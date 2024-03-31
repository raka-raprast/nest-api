import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
  @Prop()
  userId: string;

  @Prop()
  imageUrl: string | null;

  @Prop()
  name: string;

  @Prop()
  birthday: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  interests: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
