import type { Comment } from '@prisma/client';

export type NestedComment = Comment & { children: NestedComment[] };

export interface GetAllComments {
  comments: NestedComment[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}
