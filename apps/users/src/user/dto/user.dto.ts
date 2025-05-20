import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  OFFICER = 'officer',
  USER = 'user',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'role must be either officer or user' })
  role?: UserRole;

  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('CO', { message: 'phone number is not valid' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
