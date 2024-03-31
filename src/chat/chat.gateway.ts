import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ProfileService } from 'src/profile/profile.service';
import { IProfile } from 'src/interface/profile.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private profileService: ProfileService,
    @InjectModel('Profile') private profileModel: Model<IProfile>,
  ) {}

  @WebSocketServer()
  server: Server;

  async getUserFromSocket(token: string) {
    const user = await this.jwtService.decode(token);
    const isExpired = this.profileService.isTokenExpired(user.exp);
    if (isExpired) {
      throw new UnauthorizedException(
        'Session has expired please log in again',
      );
    }
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const existingProfile = await this.profileModel
      .findOne({
        $or: [{ userId: user.id }],
      })
      .exec();
    if (!existingProfile) {
      throw new BadRequestException('Something went wrong please log in again');
    }
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: existingProfile.name,
      birthday: existingProfile.birthday,
      height: existingProfile.height,
      weight: existingProfile.weight,
      interests: existingProfile.interests,
    };
  }

  @SubscribeMessage('send_message')
  async handleMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const { id, message, token } = payload;
    const user = await this.getUserFromSocket(token);
    await this.chatService.find(id);
    await this.chatService.createMessage(id, message, user.id);

    return message;
  }

  broadcastMessages(id: string, newMessage: any) {
    console.log(id);
    this.server.sockets.emit(`chatrooms/${id}`, {
      message: newMessage,
    });
  }
}
