import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MoongooseSchema } from 'mongoose';
import { User } from '@app/schemas/user.schema';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true, type: MoongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true, type: MoongooseSchema.Types.ObjectId, ref: 'Report' })
  reportId: Report;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  DateSent: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
