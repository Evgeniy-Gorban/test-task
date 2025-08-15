import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { handleError } from 'src/common/helpers/handle-error.helper';
import { AppCache } from 'src/common/types/cache.interface';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: AppCache) {}

  async generateCaptcha() {
    try {
      const captcha = svgCaptcha.create({
        size: 5,
        ignoreChars: '0o1iIl',
        noise: 2,
        color: true,
        background: '#cc9966',
      });

      const captchaId = randomUUID();
      await this.cacheManager.set(
        `captcha:${captchaId}`,
        captcha.text.toLowerCase(),
        { ttl: 60 * 5 },
      );
      return { captchaId, svg: captcha.data };
    } catch (error) {
      handleError(error, 'Error creating captcha');
    }
  }

  async validateCaptcha(captchaId: string, captcha: string): Promise<boolean> {
    try {
      const cacheCaptcha = await this.cacheManager.get<string>(
        `captcha:${captchaId}`,
      );
      const isValid = cacheCaptcha === captcha.toLowerCase();
      if (isValid) {
        await this.cacheManager.del(`captcha:${captchaId}`);
      }
      return isValid;
    } catch (error) {
      handleError(error, 'Error validating captcha');
    }
  }
}
