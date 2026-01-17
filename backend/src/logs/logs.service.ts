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

  private generateSystemFeedback(category: string, type: string, content: string): string {
    let metadata: any = {};
    try {
      // Try to parse content if it's JSON to extract metadata
      const parsed = JSON.parse(content);
      if (parsed.metadata) metadata = parsed.metadata;
    } catch (e) {
      // Content might be encrypted or just string, proceed with empty metadata
    }

    const { weather, mood, energy } = metadata;
    let candidates: string[] = [];

    // --- 1. CATEGORY BASED ---
    if (category === 'DREAM') {
      candidates.push(
        "[SYSTEM]: Subconscious data stream synchronized.",
        "[SYSTEM]: REM cycle artifacts preserved.",
        "[SYSTEM]: Abstract logic patterns analyzed.",
        "[SYSTEM]: Neural pathway mapping complete.",
        "[SYSTEM]: Dream sequence archived for analysis."
      );
    } else if (category === 'HEALTH') {
      candidates.push(
        "[SYSTEM]: Biological metrics updated.",
        "[SYSTEM]: Physical status logged.",
        "[SYSTEM]: Health integrity scan complete.",
        "[SYSTEM]: Vital signs correlation recorded.",
        "[SYSTEM]: Somatic data archived."
      );
    } else if (category === 'WORK') {
      candidates.push(
        "[SYSTEM]: Productivity metrics calculated.",
        "[SYSTEM]: Task execution cycle logged.",
        "[SYSTEM]: Output efficiency analyzed.",
        "[SYSTEM]: Professional objective tracked.",
        "[SYSTEM]: Workload data committed."
      );
    }

    // --- 2. TYPE BASED ---
    if (type === 'ERROR') {
      candidates.push(
        "[SYSTEM]: Anomaly detected. Diagnostic required.",
        "[SYSTEM]: Error log persisted. Stack trace saved.",
        "[SYSTEM]: System integrity warning.",
        "[SYSTEM]: Exception handling protocol engaged.",
        "[SYSTEM]: Glitch in the matrix recorded."
      );
    } else if (type === 'SUCCESS') {
      candidates.push(
        "[SYSTEM]: Operation completed successfully.",
        "[SYSTEM]: Outcome: POSITIVE.",
        "[SYSTEM]: Success state locked.",
        "[SYSTEM]: Optimal performance achieved.",
        "[SYSTEM]: Objective verified complete."
      );
    } else if (type === 'WARNING') {
      candidates.push(
        "[SYSTEM]: Cautionary flag raised.",
        "[SYSTEM]: Potential instability noted.",
        "[SYSTEM]: Warning threshold approached.",
        "[SYSTEM]: Alert state: YELLOW.",
        "[SYSTEM]: Preventive monitoring active."
      );
    }

    // --- 3. WEATHER BASED ---
    if (weather) {
      if (weather === '☀️') { // Sunny
        candidates.push(
          "[SYSTEM]: Solar input efficiency: 100%.",
          "[SYSTEM]: Visibility conditions: OPTIMAL.",
          "[SYSTEM]: External temperature nominal.",
          "[SYSTEM]: Photovoltaic potential high.",
          "[SYSTEM]: Clear sky protocols engaged."
        );
      } else if (weather === '🌧️' || weather === '⛈️') { // Rain/Storm
        candidates.push(
          "[SYSTEM]: External precipitation detected.",
          "[SYSTEM]: Atmospheric humidity rising.",
          "[SYSTEM]: Acoustic rain pattern recognized.",
          "[SYSTEM]: Environment: WET.",
          "[SYSTEM]: Hydro-static pressure alert."
        );
      } else if (weather === '❄️') { // Snow
        candidates.push(
          "[SYSTEM]: Low temperature warning.",
          "[SYSTEM]: Cryogenic conditions external.",
          "[SYSTEM]: Thermal regulation active.",
          "[SYSTEM]: Friction coefficient reduced.",
          "[SYSTEM]: Environment: FROZEN."
        );
      } else if (weather === '🌑' || weather === '☁️') { // Dark/Cloudy
        candidates.push(
          "[SYSTEM]: Low light conditions.",
          "[SYSTEM]: UV index low.",
          "[SYSTEM]: Night vision recommended.",
          "[SYSTEM]: Atmospheric density high.",
          "[SYSTEM]: Shadow operational mode."
        );
      }
    }

    // --- 4. MOOD BASED ---
    if (mood) {
      if (['😊', '🤩', '🎉'].includes(mood)) { // Happy/Excited
        candidates.push(
          "[SYSTEM]: User morale operating at peak efficiency.",
          "[SYSTEM]: Positive emotional state locked.",
          "[SYSTEM]: Dopamine receptors active.",
          "[SYSTEM]: Optimal psychological condition verified.",
          "[SYSTEM]: Mood metric: EXCELLENT."
        );
      } else if (['😢', '😞', '☹️'].includes(mood)) { // Sad
        candidates.push(
          "[SYSTEM]: Serotonin deficiency noted.",
          "[SYSTEM]: Emotional support protocol standby.",
          "[SYSTEM]: Resilience check required.",
          "[SYSTEM]: Empathy module initializing...",
          "[SYSTEM]: Psychological dampening detected."
        );
      } else if (['😡', '😠'].includes(mood)) { // Angry
        candidates.push(
          "[SYSTEM]: Cortisol levels elevated.",
          "[SYSTEM]: Aggression dampening recommended.",
          "[SYSTEM]: Stress threshold exceeded.",
          "[SYSTEM]: Cooling logic applied.",
          "[SYSTEM]: Emotional volatility high."
        );
      } else if (['🤔', '🧘'].includes(mood)) { // Thinking/Zen
        candidates.push(
          "[SYSTEM]: Cognitive processing intensified.",
          "[SYSTEM]: Neural network training in progress.",
          "[SYSTEM]: Focus state: DEEP.",
          "[SYSTEM]: Analytical subroutine running.",
          "[SYSTEM]: Mental clarity optimization."
        );
      } else if (['😴', '😐'].includes(mood)) { // Sleepy/Neutral
        candidates.push(
          "[SYSTEM]: Background processes idling.",
          "[SYSTEM]: Status: STABLE/NEUTRAL.",
          "[SYSTEM]: Low variance detected.",
          "[SYSTEM]: Maintenance mode ready.",
          "[SYSTEM]: Equilibrium established."
        );
      }
    }

    // --- 5. ENERGY BASED ---
    if (energy !== undefined && energy !== null) {
      const eVal = parseInt(energy);
      if (!isNaN(eVal)) {
        if (eVal < 30) {
          candidates.push(
            "[SYSTEM]: Low power warning. Recharge recommended.",
            "[SYSTEM]: Energy reserves critical. Conservation mode.",
            "[SYSTEM]: System fatigue detected.",
            "[SYSTEM]: Metabolic output reduced.",
            "[SYSTEM]: Suggesting hibernation cycle."
          );
        } else if (eVal > 80) {
          candidates.push(
            "[SYSTEM]: Power output maximum.",
            "[SYSTEM]: Kinetic potential at 100%.",
            "[SYSTEM]: High energy state confirmed.",
            "[SYSTEM]: System overclocking active.",
            "[SYSTEM]: Ready for heavy processing loads."
          );
        }
      }
    }

    // --- FALLBACK POOL ---
    const genericPool = [
      "[SYSTEM]: Entry recorded. No improvement detected.",
      "[SYSTEM]: Survival confirmed.",
      "[SYSTEM]: Emotional fluctuation archived.",
      "[SYSTEM]: Timeline extended.",
      "[SYSTEM]: Existence verified.",
      "[SYSTEM]: Memory fragment secured.",
      "[SYSTEM]: Data integrity verified.",
      "[SYSTEM]: Log committed to core memory.",
      "[SYSTEM]: Chronological marker set.",
      "[SYSTEM]: Reality anchor updated."
    ];

    // If we have candidates, shuffle and pick one.
    // If candidates list is short (< 3), mix in some generics to add variety.
    if (candidates.length < 3) {
      candidates = [...candidates, ...genericPool];
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  async create(
    userId: string,
    content: string,
    status: SystemStatus,
    category: string,
    type: string,
    logDate?: Date,
    metadata?: { weather?: string; mood?: string; energy?: number; icon?: string }
  ) {
    // 1. Calculate Gamification Rewards
    let exp = 10; // Base EXP
    if (content && content.length > 50) exp += 20;
    if (status === SystemStatus.DEGRADED || status === SystemStatus.OVERLOADED) exp += 15;
    if (type === 'ERROR' || type === 'CRITICAL') exp += 10;

    // 2. Select Feedback (Dynamic)
    const feedback = this.generateSystemFeedback(category, type, content);

    // 3. Encrypt Content
    const encryptedContent = this.encryptionService.encrypt(content);

    // 4. Extract metadata if not provided explicitly but available in content JSON
    let finalMetadata = { ...metadata };
    if (!metadata) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.metadata) {
          finalMetadata = { ...parsed.metadata };
        }
        // Try to find icon in sysTrace if needed, or rely on passed metadata
      } catch (e) {}
    }

    const newLog = new this.logModel({
      userId,
      content: encryptedContent,
      status,
      category,
      type,
      systemFeedback: feedback,
      expGranted: exp,
      logDate: logDate || new Date(),
      weather: finalMetadata.weather,
      mood: finalMetadata.mood,
      energy: finalMetadata.energy,
      icon: finalMetadata.icon,
    });

    return newLog.save();
  }

  async findAll(
    userId: string,
    limit: number = 20,
    offset: number = 0,
    filters?: {
      category?: string;
      type?: string;
      weather?: string;
      mood?: string;
      energyLevel?: number;
      energyOp?: 'gt' | 'lt' | 'eq'; // greater than, less than
      icon?: string;
      search?: string; // keyword search
    }
  ) {
    const query: any = { userId };

    if (filters) {
      if (filters.category) query.category = filters.category;
      if (filters.type) query.type = filters.type;
      if (filters.weather) query.weather = filters.weather;
      if (filters.mood) query.mood = filters.mood;
      if (filters.icon) query.icon = filters.icon;

      if (filters.energyLevel !== undefined) {
        // Convert to number because query param might be string
        const eLevel = Number(filters.energyLevel);
        if (!isNaN(eLevel)) {
          if (filters.energyOp === 'gt') query.energy = { $gte: eLevel };
          else if (filters.energyOp === 'lt') query.energy = { $lte: eLevel };
          else query.energy = eLevel;
        }
      }

      if (filters.search) {
        // If searching by keyword, we CANNOT do it via DB query effectively because content is encrypted.
        // STRATEGY: 
        // 1. Fetch ALL logs matching other filters (category, etc.) for this user.
        // 2. Decrypt in memory.
        // 3. Filter by keyword.
        // 4. Manual pagination.
        
        // Remove 'limit' and 'offset' from initial DB fetch, but keep other filters
        const allCandidates = await this.logModel
          .find(query)
          .sort({ logDate: -1, createdAt: -1 })
          .exec();

        const keyword = filters.search.toLowerCase();

        const filtered = allCandidates.filter(log => {
          let content = "";
          try {
            content = this.encryptionService.decrypt(log.content).toLowerCase();
          } catch (e) {
            content = "";
          }

          // Check if keyword exists in decrypted content OR metadata
          // (Metadata checks here are redundant if we kept them in DB query, but necessary if we removed $or)
          // Actually, we haven't added $or to 'query' yet in this block.
          return (
            content.includes(keyword) ||
            log.systemFeedback?.toLowerCase().includes(keyword) ||
            log.category?.toLowerCase().includes(keyword) ||
            log.type?.toLowerCase().includes(keyword) ||
            log.weather?.includes(keyword) ||
            log.mood?.includes(keyword)
          );
        });

        // Apply pagination manually
        const paged = filtered.slice(offset, offset + limit);

        return paged.map(log => {
          const logObj = log.toObject();
          try {
            logObj.content = this.encryptionService.decrypt(logObj.content);
          } catch (e) {}
          return logObj;
        });
      }
    }

    const logs = await this.logModel
      .find(query)
      .sort({ logDate: -1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return logs.map((log) => {
      const logObj = log.toObject();
      try {
        logObj.content = this.encryptionService.decrypt(logObj.content);
      } catch (e) {
        // If decryption fails, return as is or error
      }
      return logObj;
    });
  }

  async deleteLog(userId: string, logId: string) {
    return this.logModel.findOneAndDelete({ _id: logId, userId }).exec();
  }

  async updateLog(userId: string, logId: string, updates: any) {
    // If updating content, encrypt it
    if (updates.content) {
      updates.content = this.encryptionService.encrypt(updates.content);
    }
    return this.logModel.findOneAndUpdate({ _id: logId, userId }, updates, { new: true }).exec();
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
