import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('init')
  async initialize(@Body('username') username: string) {
    return this.playerService.create(username);
  }

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
}
