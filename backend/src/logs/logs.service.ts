import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemLog, LogDocument, SystemStatus } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(SystemLog.name) private logModel: Model<LogDocument>) {}

  private SYSTEM_FEEDBACK_POOL = [
    "[SYSTEM]: Entry recorded. No improvement detected.",
    "[SYSTEM]: Survival confirmed.",
    "[SYSTEM]: Emotional fluctuation archived.",
    "[SYSTEM]: Timeline extended.",
    "[SYSTEM]: Existence verified.",
    "[SYSTEM]: Memory fragment secured.",
  ];

  async create(userId: string, content: string, status: SystemStatus, category: string, type: string) {
    // 1. Calculate Gamification Rewards
    let exp = 10; // Base EXP
    if (content && content.length > 50) exp += 20;
    if (status === SystemStatus.DEGRADED || status === SystemStatus.OVERLOADED) exp += 15; // Reward for enduring hard times
    if (type === 'ERROR' || type === 'CRITICAL') exp += 10; // Surviving errors

    // 2. Select Feedback
    const feedback = this.SYSTEM_FEEDBACK_POOL[Math.floor(Math.random() * this.SYSTEM_FEEDBACK_POOL.length)];

    const newLog = new this.logModel({
      userId,
      content,
      status,
      category,
      type,
      systemFeedback: feedback,
      expGranted: exp,
    });

    return newLog.save();
  }

  async findAll(userId: string, limit: number = 20, offset: number = 0) {
    return this.logModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async getStats(userId: string) {
    return this.logModel.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
  }

  async search(userId: string, query: string) {
    return this.logModel.find({
      userId,
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { systemFeedback: { $regex: query, $options: 'i' } },
        { status: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 }).limit(50).exec();
  }
}
