import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { OptionalAuthGuard } from 'src/common/guards/optional-auth.guard';
import { UserRequest } from 'src/common/types/user-request';
import { QueryGetCommentsDto } from './dto/query-get-comments.dto';
import { GetAllComments } from 'src/common/types/comments-get-all';

@UseGuards(OptionalAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getAll(@Query() query: QueryGetCommentsDto): Promise<GetAllComments> {
    return this.commentsService.getAll(query);
  }

  @Post()
  async create(@Body() dto: CreateCommentDto, @Req() req: UserRequest) {
    await this.commentsService.create(dto, req);
    return { success: true };
  }
}
