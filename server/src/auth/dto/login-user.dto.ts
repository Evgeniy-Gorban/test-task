import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(70, { message: 'Password must be shorter than 70 characters' })
  password: string;
}
