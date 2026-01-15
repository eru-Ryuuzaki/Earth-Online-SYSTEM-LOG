import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PlayerService } from '../player/player.service';

@Injectable()
export class AuthService {
  constructor(
    private playerService: PlayerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const player = await this.playerService.findByUsername(username);
    if (player && (await bcrypt.compare(pass, player.password))) {
      const { password, ...result } = player.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      player: user,
    };
  }

  async register(username: string, pass: string) {
    const existingUser = await this.playerService.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Identity already registered.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);
    const newPlayer = await this.playerService.create(username, hash);
    const { password, ...result } = newPlayer.toObject();
    return this.login(result); // Auto login after register
  }
}
