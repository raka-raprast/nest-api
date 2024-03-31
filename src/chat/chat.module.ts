import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { ProfileService } from 'src/profile/profile.service';
import { ProfileSchema } from 'src/schemas/profile.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/schemas/message.schema';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: 'Messages', schema: MessageSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ChatGateway, ChatService, JwtStrategy, ProfileService],
  controllers: [ChatController],
})
export class ChatModule {}
