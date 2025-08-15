import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { handleError } from 'src/common/helpers/handle-error.helper';
import { sanitizeUserData } from 'src/common/util/sanitizer.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    try {
      const { email, name, homePage } = sanitizeUserData(dto);

      const existUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existUser) {
        throw new ConflictException('This email is already in use');
      }

      await this.prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash(dto.password, 12),
          name,
          homePage,
        },
      });
    } catch (error) {
      handleError(error, 'Failed to register');
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const { email, password } = dto;

      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { id: user.id };
      const accessToken = await this.jwtService.signAsync(payload);

      return { accessToken };
    } catch (error) {
      handleError(error, 'Failed to login');
    }
  }
}
