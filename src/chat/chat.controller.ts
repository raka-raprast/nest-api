import { Controller, Post } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Get('api/viewMessages')
  @ApiTags('chat')
  listChatRooms() {
    return this.chatService.findMany;
  }

  @ApiTags('chat')
  @Post('api/sendMessage')
  async sendMessage() {
    return this.chatService.createMessage;
  }
}
