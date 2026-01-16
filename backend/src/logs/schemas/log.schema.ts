import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = SystemLog & Document;

export enum SystemStatus {
  STABLE = 'STABLE',
  UNSTABLE = 'UNSTABLE',
  DEGRADED = 'DEGRADED',
  OVERLOADED = 'OVERLOADED',
  EMPTY = 'EMPTY',
  UNKNOWN = 'UNKNOWN',
}

@Schema({ timestamps: true })
export class SystemLog {
  @Prop({ required: true })
  userId: string; // Should link to User ObjectId

  @Prop()
  content: string;

  @Prop({ default: 'SYSTEM' })
  category: string;

  @Prop({ default: 'INFO' })
  type: string;

  @Prop({ enum: SystemStatus, default: SystemStatus.UNKNOWN })
  status: SystemStatus;

  @Prop()
  systemFeedback: string;

  @Prop({ default: false })
  isArchived: boolean;

  // Gamification fields
  @Prop({ default: 0 })
  expGranted: number;

  @Prop({ default: Date.now })
  logDate: Date;
}

export const LogSchema = SchemaFactory.createForClass(SystemLog);
