import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  private isProd(): boolean {
    return this.configService.getOrThrow<string>('NODE_ENV') === 'production';
  }

  setAccessToken(res: Response, token: string) {
    res.cookie('dZENcode_access', token, {
      httpOnly: true,
      secure: this.isProd(),
      sameSite: this.isProd() ? 'strict' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  clearAccessToken(res: Response) {
    res.clearCookie('dZENcode_access', {
      httpOnly: true,
      secure: this.isProd(),
      sameSite: this.isProd() ? 'strict' : 'lax',
    });
  }
}
