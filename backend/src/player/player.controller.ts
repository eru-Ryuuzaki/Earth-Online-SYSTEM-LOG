import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':username')
  async getStatus(@Param('username') username: string) {
    return this.playerService.findByUsername(username);
  }

  @Patch('sync')
  async syncStatus(
    @Body('username') username: string,
    @Body('action') action: string
  ) {
    return this.playerService.syncStatus(username, action);
  }

  @Patch(':username/profile')
  async updateProfile(
    @Param('username') username: string,
    @Body() updates: any
  ) {
    return this.playerService.updateProfile(username, updates);
  }
}
