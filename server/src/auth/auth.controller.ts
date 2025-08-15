import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CookieService } from 'src/common/services/cookie.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { OptionalAuthGuard } from 'src/common/guards/optional-auth.guard';
import { UserRequest } from 'src/common/types/user-request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    await this.authService.register(dto);
    return { success: true };
  }

  @Post('login')
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.login(dto);
    this.cookieService.setAccessToken(res, accessToken);
    return { success: true };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearAccessToken(res);
    return { success: true };
  }

  @UseGuards(OptionalAuthGuard)
  @Get('me')
  getMe(@Req() req: UserRequest) {
    return req.user || null;
  }
}
