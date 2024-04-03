import { Injectable } from '@nestjs/common';
// import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/chat.entity';
import { InjectModel } from '@nestjs/mongoose';
import { IChat } from 'src/interface/chat.interface';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
// import { ChatItem } from 'src/schemas/chat-item.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Messages') private chatModel: Model<IChat>,
    private jwtService: JwtService,
  ) {}
  messages: Message[] = [{ senderId: 'Raka', text: 'heyoo' }];
  clientToUser = {};
  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  async findMany(id: string) {
    const listRooms = await this.chatModel
      .find({ participant: { $in: [id] } })
      .exec();
    return listRooms;
  }

  async find(id: string) {
    const listRooms = await this.chatModel.findOne({ id: id }).exec();
    return listRooms;
  }

  async createMessage(msg: string, roomId: string, senderId: string) {
    await this.chatModel.updateOne({ messages: [...msg] });
    const message = {
      senderId: senderId,
      text: msg,
    };
    this.messages.push(message);
    return message;
  }
}
