import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';

@Injectable()
export class PlayerService {
  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>) {}

  async create(username: string, passwordHash: string) {
    const createdPlayer = new this.playerModel({ username, password: passwordHash });
    return createdPlayer.save();
  }

  async findByUsername(username: string) {
    return this.playerModel.findOne({ username }).exec();
  }

  async syncStatus(username: string, action: string) {
    const player = await this.findByUsername(username);
    if (!player) return null;

    // Game Logic
    switch (action) {
      case 'SLEEP':
        player.hp = player.maxHp;
        player.mental += 20;
        if (player.mental > 100) player.mental = 100;
        break;
      case 'WORK':
        player.mental -= 10;
        player.exp += 15;
        break;
      case 'DAMAGE':
        player.hp -= 10;
        break;
    }

    // Level Up Logic
    if (player.exp >= player.maxExp) {
      player.level += 1;
      player.exp -= player.maxExp;
      player.maxExp = Math.floor(player.maxExp * 1.2);
      player.maxHp += 10;
      player.hp = player.maxHp; // Full heal on level up
    }

    return player.save();
  }

  async updateProfile(username: string, updates: Partial<Player>) {
    return this.playerModel.findOneAndUpdate(
      { username },
      { $set: updates },
      { new: true }
    ).exec();
  }
}
