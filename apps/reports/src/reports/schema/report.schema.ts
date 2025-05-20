import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '@app/schemas/user.schema';

export enum ReportCategory {
  INFRASTRUCTURE = 'infraestructura',
  SECURITY = 'seguridad',
  ENVIRONMENT = 'medio ambiente',
}

export enum ReportState {
  PENDING = 'pendiente',
  IN_PROGRESS = 'en proceso',
  COMPLETED = 'terminada',
}

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  image_url: string;

  @Prop({ type: String, enum: ReportCategory, required: true })
  category: ReportCategory;

  @Prop({ type: String, enum: ReportState, default: ReportState.PENDING })
  state: ReportState;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: User;

  @Prop({ default: Date.now })
  creation_date: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
