import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'Comment text must be a string' })
  @MinLength(10, {
    message: 'Comment text must be at least 10 characters',
  })
  @MaxLength(2000, { message: 'Comment text must not exceed 2000 characters' })
  text: string;

  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  userName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(250, { message: 'Email must not exceed 250 characters' })
  email?: string;

  @IsOptional()
  @IsUrl(
    { require_protocol: true },
    { message: 'The url must be valid and include http(s) protocol' },
  )
  @MaxLength(250, { message: 'Homepage URL must not exceed 250 characters' })
  homePage?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Parent ID must be an integer' })
  @Min(1, { message: 'Parent ID must be at least 1' })
  parentId?: number;

  @IsOptional()
  @IsString({ message: 'Captcha must be a string' })
  @MaxLength(100, { message: 'Captcha must not exceed 100 characters' })
  captcha?: string;

  @IsOptional()
  @IsString({ message: 'Captcha ID must be a string' })
  captchaId?: string;

  @IsOptional()
  @IsString({ message: 'File path must be a string' })
  filePath?: string;

  @IsOptional()
  @IsIn(['text', 'image'], {
    message: 'File type must be either text or image',
  })
  fileType?: 'text' | 'image';

  @IsOptional()
  @IsString({ message: 'Original file name must be a string' })
  @MaxLength(100, {
    message: 'Original file name must not exceed 100 characters',
  })
  originalName?: string;
}
