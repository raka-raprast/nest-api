import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ChatItem } from './chat-item.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop()
  chatroomId: string;

  @Prop()
  participant: string[];

  @Prop()
  messages: ChatItem[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
