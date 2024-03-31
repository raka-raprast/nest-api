import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';

export type ChatItemDocument = HydratedDocument<ChatItem>;

@Schema()
export class ChatItem {
  @Prop()
  senderId: string;

  @Prop()
  message: Message;
}

export const ChatItemSchema = SchemaFactory.createForClass(ChatItem);
