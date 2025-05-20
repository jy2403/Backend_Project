import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserServiceInterface } from './user/interface/user.interface';
import {
  CreateUserDto,
  VerifyEmailDto,
  LoginDto,
  ChangePasswordDto,
} from './user/dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  User as SchemaUser,
  ContactInfo as SchemaContactInfo,
  UserDocument,
  ContactInfoDocument,
} from '@app/schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@app/email/email.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService implements UserServiceInterface {
  constructor(
    @InjectModel(SchemaUser.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(SchemaContactInfo.name)
    private readonly contactInfoModel: Model<ContactInfoDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  private toUserInterface(user: UserDocument): User {
    const userObj = user.toObject();
    userObj.id = userObj._id.toString();
    delete userObj.password;
    delete userObj._v;
    return userObj as User;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({
        email: createUserDto.email,
      })
      .exec();
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 5,
    );

    const user = new this.userModel({
      ...createUserDto,
      contactInfo: new this.contactInfoModel({
        phone: createUserDto.phone,
        address: createUserDto.address,
      }),
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
    });
    const savedUser = await user.save();

    await this.emailService.sendVerificationEmail(
      savedUser.email,
      savedUser.firstName,
      verificationCode,
    );
    return this.toUserInterface(savedUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.toUserInterface(user));
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return this.toUserInterface(user);
  }

  async verifyUser(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const { email, code } = verifyEmailDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    if (user.isVerified) {
      return { message: 'User already verified' };
    }
    if (user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }
    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    ) {
      throw new BadRequestException('Verification code expired');
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    return { message: 'User verified' };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const user = await this.userModel.findOne({ email: loginDto.email }).exec();
    if (!user) {
      throw new NotFoundException(
        `User with email "${loginDto.email}" not found`,
      );
    }

    if (!user.isVerified) {
      throw new BadRequestException('User not verified');
    }
    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid password');
    }
    const tokens = await this.getTokens(user.id, user.email);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();
    return {
      ...tokens,
      user: this.toUserInterface(user),
    };
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    const isPasswordCorrect = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }

  private async getTokens(
    userId: string,
    email: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    console.log(userId);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, email },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        { userId, email },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
