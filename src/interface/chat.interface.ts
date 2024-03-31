import { Document } from 'mongoose';
import { ChatItem } from 'src/schemas/chat-item.schema';
export interface IChat extends Document {
  readonly chatRoomId: string;
  readonly participant: string[];
  readonly messages: ChatItem[];
}
