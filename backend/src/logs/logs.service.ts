import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemLog, LogDocument, SystemStatus } from './schemas/log.schema';
import { EncryptionService } from '../common/encryption.service';

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    @InjectModel(SystemLog.name) private logModel: Model<LogDocument>,
    private encryptionService: EncryptionService
  ) {}

  private SYSTEM_FEEDBACK_POOL = [
    "[SYSTEM]: Entry recorded. No improvement detected.",
    "[SYSTEM]: Survival confirmed.",
    "[SYSTEM]: Emotional fluctuation archived.",
    "[SYSTEM]: Timeline extended.",
    "[SYSTEM]: Existence verified.",
    "[SYSTEM]: Memory fragment secured.",
  ];

  async create(userId: string, content: string, status: SystemStatus, category: string, type: string, logDate?: Date) {
    // 1. Calculate Gamification Rewards
    let exp = 10; // Base EXP
    if (content && content.length > 50) exp += 20;
    if (status === SystemStatus.DEGRADED || status === SystemStatus.OVERLOADED) exp += 15; // Reward for enduring hard times
    if (type === 'ERROR' || type === 'CRITICAL') exp += 10; // Surviving errors

    // 2. Select Feedback
    const feedback = this.SYSTEM_FEEDBACK_POOL[Math.floor(Math.random() * this.SYSTEM_FEEDBACK_POOL.length)];

    // 3. Encrypt Content
    const encryptedContent = this.encryptionService.encrypt(content);

    const newLog = new this.logModel({
      userId,
      content: encryptedContent,
      status,
      category,
      type,
      systemFeedback: feedback,
      expGranted: exp,
      logDate: logDate || new Date(),
    });

    return newLog.save();
  }

  async findAll(userId: string, limit: number = 20, offset: number = 0) {
    const logs = await this.logModel.find({ userId })
      .sort({ logDate: -1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return logs.map(log => {
      const logObj = log.toObject();
      logObj.content = this.encryptionService.decrypt(logObj.content);
      return logObj;
    });
  }

  async getStats(userId: string) {
    return this.logModel.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
  }

  async search(userId: string, query: string) {
    // Note: Search on 'content' is limited due to encryption. 
    // Regular regex search won't work on encrypted strings.
    // We only search on metadata and feedback.
    const logs = await this.logModel.find({
      userId,
      $or: [
        // { content: { $regex: query, $options: 'i' } }, // Cannot regex search encrypted content
        { systemFeedback: { $regex: query, $options: 'i' } },
        { status: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } }
      ]
    }).sort({ logDate: -1, createdAt: -1 }).limit(50).exec();

    return logs.map(log => {
      const logObj = log.toObject();
      logObj.content = this.encryptionService.decrypt(logObj.content);
      return logObj;
    });
  }
}
