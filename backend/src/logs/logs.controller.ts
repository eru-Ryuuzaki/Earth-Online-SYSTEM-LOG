import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LogsService } from './logs.service';
import { SystemStatus } from './schemas/log.schema';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('commit')
  async commitLog(@Request() req, @Body() body: any) {
    return this.logsService.create(
      req.user.userId,
      body.content,
      body.status || SystemStatus.UNKNOWN,
      body.category || 'SYSTEM',
      body.type || 'INFO',
      body.logDate // Optional: user provided date
    );
  }

  @Get('timeline')
  async getTimeline(
    @Query('userId') userId: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number
  ) {
    return this.logsService.findAll(userId, limit, offset);
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
