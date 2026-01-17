import { Controller, Get, Post, Body, Query, Param, UseGuards, Request, Delete, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LogsService } from './logs.service';
import { SystemStatus } from './schemas/log.schema';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('commit')
  async commitLog(@Request() req, @Body() body: any) {
    // Extract metadata from body or let service try to find it in content
    const metadata = {
      weather: body.weather || body.metadata?.weather,
      mood: body.mood || body.metadata?.mood,
      energy: body.energy || body.metadata?.energy,
      icon: body.icon || body.metadata?.icon, // Frontend should send this
    };

    return this.logsService.create(
      req.user.userId,
      body.content,
      body.status || SystemStatus.UNKNOWN,
      body.category || 'SYSTEM',
      body.type || 'INFO',
      body.logDate,
      metadata
    );
  }

  @Get('timeline')
  async getTimeline(
    @Query('userId') userId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    // Filter params
    @Query('category') category?: string,
    @Query('type') type?: string,
    @Query('weather') weather?: string,
    @Query('mood') mood?: string,
    @Query('energyLevel') energyLevel?: number,
    @Query('energyOp') energyOp?: 'gt' | 'lt' | 'eq',
    @Query('icon') icon?: string,
    @Query('search') search?: string
  ) {
    return this.logsService.findAll(userId, limit, offset, {
      category,
      type,
      weather,
      mood,
      energyLevel,
      energyOp,
      icon,
      search,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteLog(@Request() req, @Param('id') id: string) {
    return this.logsService.deleteLog(req.user.userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateLog(@Request() req, @Param('id') id: string, @Body() updates: any) {
    return this.logsService.updateLog(req.user.userId, id, updates);
  }

  @Get('stats')
  async getStats(@Query('userId') userId: string) {
    return this.logsService.getStats(userId);
  }

  @Get('search')
  async search(
    @Query('userId') userId: string,
    @Query('q') query: string
  ) {
    return this.logsService.search(userId, query);
  }
}
