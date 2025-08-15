import { BadRequestException } from '@nestjs/common';
import { CaptchaService } from 'src/captcha/captcha.service';

export async function validateCaptcha(
  captchaService: CaptchaService,
  userId?: number,
  captchaId?: string,
  captcha?: string,
) {
  if (userId) return;

  if (!captcha || !captchaId)
    throw new BadRequestException('Captcha is required');

  const isValid = await captchaService.validateCaptcha(captchaId, captcha);

  if (!isValid) throw new BadRequestException('Invalid captcha');
}
