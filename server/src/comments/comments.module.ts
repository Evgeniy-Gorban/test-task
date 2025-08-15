import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CaptchaModule } from 'src/captcha/captcha.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [CaptchaModule, UploadModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
