import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { SystemLog, LogSchema } from './schemas/log.schema';
import { EncryptionService } from '../common/encryption.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: SystemLog.name, schema: LogSchema }])],
  controllers: [LogsController],
  providers: [LogsService, EncryptionService],
})
export class LogsModule {}
