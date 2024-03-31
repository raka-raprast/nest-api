import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}
  @Get('api/viewMessages')
  listChatRooms() {
    return;
  }
}
