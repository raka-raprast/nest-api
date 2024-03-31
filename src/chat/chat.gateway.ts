import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'https';
import { Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from 'src/profile/profile.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { IProfile } from 'src/interface/profile.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private jwtService: JwtService,
    private profileService: ProfileService,
    @InjectModel('Profile') private profileModel: Model<IProfile>,
  ) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.chatService.create(createMessageDto, client.id);

    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody('name') token: string,
    @ConnectedSocket() client: Socket,
  ) {
    const user = await this.jwtService.decode(token);
    const isExpired = await this.profileService.isTokenExpired(user.exp);
    if (isExpired) {
      throw new UnauthorizedException(
        'Session has expired please log in again',
      );
    }
    return this.chatService.identify(user.username, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const name = await this.chatService.getClientName(client.id);

    client.broadcast.emit('typing', { name, isTyping });
  }
}
