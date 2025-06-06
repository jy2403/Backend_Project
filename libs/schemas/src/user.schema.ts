import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'apps/users/src/user/dto/user.dto';

export type UserDocument = User & Document;
export type ContactInfoDocument = ContactInfo & Document;
@Schema()
export class ContactInfo {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;
}

export const ContactInfoSchema = SchemaFactory.createForClass(ContactInfo);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, required: false })
  refreshToken?: string;

  @Prop({ type: String, required: false })
  verificationCode?: string;

  @Prop({ type: Date, required: false })
  verificationCodeExpires?: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: ContactInfoSchema, required: true })
  contactInfo: ContactInfo;
}
export const UserSchema = SchemaFactory.createForClass(User);
