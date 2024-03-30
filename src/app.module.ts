import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/users.schema';
import { ProfileSchema } from './schemas/profile.schema';
import { ProfileModule } from './profile/profile.module';
import { mongodbsv } from './auth/constants';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    ProfileModule,
    MongooseModule.forRoot(mongodbsv),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
