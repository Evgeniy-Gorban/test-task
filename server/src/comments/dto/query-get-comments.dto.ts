import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import type {
  SortByComments,
  SortOrderComments,
} from 'src/common/types/comments-sorting';

export class QueryGetCommentsDto {
  @IsOptional()
  @IsIn(['name', 'email', 'date'], {
    message: 'SortBy must be one of: name, email, date',
  })
  sortBy: SortByComments = 'date';

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Order must be either asc or desc' })
  order: SortOrderComments = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;
}
