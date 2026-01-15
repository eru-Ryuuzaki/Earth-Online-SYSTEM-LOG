import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  email: string;

  // RPG Stats
  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  exp: number;

  @Prop({ default: 100 })
  maxExp: number;

  @Prop({ default: 100 })
  hp: number;

  @Prop({ default: 100 })
  maxHp: number;

  @Prop({ default: 80 })
  mental: number; // Mental Stability

  @Prop({ default: 0 })
  coins: number;

  @Prop([String])
  buffs: string[]; // Simplification: just store buff IDs or names
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
