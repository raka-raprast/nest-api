import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  text: string;

  @Prop()
  type: string; // 'text', 'image', 'audio'

  @Prop()
  attachmentUrl: string | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
