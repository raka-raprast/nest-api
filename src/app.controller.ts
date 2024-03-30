import { Controller } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { ProfileService } from './profile/profile.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}
}
