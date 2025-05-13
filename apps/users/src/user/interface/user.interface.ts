import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  VerifyEmailDto,
} from '../dto/user.dto';

export interface User {
  _id?: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: string;
  createdAt: Date;
  contactInfo: {
    phone: string;
    address: string;
  };
}

export interface UserServiceInterface {
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findByEmail(email: string): Promise<User>;
  verifyUser(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }>;
  login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }>;
  changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void>;
}
