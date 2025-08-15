import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserRequest } from 'src/common/types/user-request';
import { QueryGetCommentsDto } from './dto/query-get-comments.dto';
import type {
  SortByComments,
  SortOrderComments,
} from 'src/common/types/comments-sorting';
import { CaptchaService } from 'src/captcha/captcha.service';
import { handleError } from 'src/common/helpers/handle-error.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { validateCaptcha } from 'src/common/helpers/captcha-validation.helper';
import { sanitizeCommentData } from 'src/common/util/sanitizer.util';
import {
  GetAllComments,
  NestedComment,
} from 'src/common/types/comments-get-all';
import { AppCache } from 'src/common/types/cache.interface';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly captchaService: CaptchaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: AppCache,
  ) {}

  private getOrderBy(sortBy: SortByComments, order: SortOrderComments) {
    switch (sortBy) {
      case 'name':
        return [{ user: { name: order } }, { userName: order }];
      case 'email':
        return [{ user: { email: order } }, { email: order }];
      default:
        return { createdAt: order };
    }
  }

  async getAll(query: QueryGetCommentsDto): Promise<GetAllComments> {
    try {
      const { sortBy, order, page } = query;

      const cacheKey = `comments:${sortBy}:${order}:${page}`;

      const cached = await this.cacheManager.get<GetAllComments>(cacheKey);
      if (cached) return cached;

      const orderBy = this.getOrderBy(sortBy, order);
      const take = 25;
      const skip = (page - 1) * take;

      const totalComments = await this.prisma.comment.count({
        where: { parentId: null },
      });

      const parentComments = await this.prisma.comment.findMany({
        where: { parentId: null },
        orderBy,
        include: { user: true, file: true },
        take,
        skip,
      });

      if (parentComments.length === 0) {
        const result = {
          comments: [],
          pagination: { page, pageSize: take, total: totalComments },
        };
        await this.cacheManager.set(cacheKey, result, { ttl: 60 * 5 });
        return result;
      }

      const parentCommentsIds = parentComments.map((comment) => comment.id);
      const allChildComments: Comment[] = [];
      let currentCommentIds = [...parentCommentsIds];

      while (currentCommentIds.length > 0) {
        const children = await this.prisma.comment.findMany({
          where: { parentId: { in: currentCommentIds } },
          orderBy: { createdAt: 'desc' },
          include: { user: true, file: true },
        });

        if (children.length === 0) break;

        allChildComments.push(...children);
        currentCommentIds = children.map((c) => c.id);
      }

      const commentById: Record<number, NestedComment> = {};

      for (const comment of parentComments) {
        commentById[comment.id] = { ...comment, children: [] };
      }
      for (const comment of allChildComments) {
        const nested = { ...comment, children: [] };
        commentById[comment.id] = nested;
        commentById[comment.parentId!]?.children.push(nested);
      }

      const comments = parentComments.map((comment) => commentById[comment.id]);
      const pagination = {
        page,
        pageSize: take,
        total: totalComments,
      };

      const result = { comments, pagination };

      await this.cacheManager.set(cacheKey, result, { ttl: 60 * 5 });

      return result;
    } catch (error) {
      handleError(error, 'Error fetching all comments');
    }
  }

  async create(dto: CreateCommentDto, req: UserRequest) {
    try {
      const userId = req.user?.id;

      await validateCaptcha(
        this.captchaService,
        userId,
        dto.captchaId,
        dto.captcha,
      );

      const { text, userName, email, homePage } = sanitizeCommentData(dto);

      if (dto.parentId) {
        const parentExists = await this.prisma.comment.findUnique({
          where: { id: dto.parentId },
        });
        if (!parentExists)
          throw new BadRequestException('Parent comment not found');
      }

      const newComment = await this.prisma.$transaction(async (tx) => {
        const comment = await tx.comment.create({
          data: {
            text,
            parentId: dto.parentId || null,
            userId,
            userName: userId ? undefined : userName,
            email: userId ? undefined : email,
            homePage: userId ? undefined : homePage,
          },
        });

        if (dto.filePath && dto.fileType) {
          await tx.commentFile.create({
            data: {
              commentId: comment.id,
              filePath: dto.filePath,
              fileType: dto.fileType,
              originalName: dto.originalName,
            },
          });
        }

        return comment;
      });

      if (this.cacheManager.keys) {
        const keys = await this.cacheManager.keys('comments:*');
        for (const key of keys) await this.cacheManager.del(key);
      }

      return newComment;
    } catch (error) {
      handleError(error, 'Error creating comment');
    }
  }
}
