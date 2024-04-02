import { Module } from '@nestjs/common';
import { ChannelService } from './service';
import { ChannelResolver } from './resolver';
import { DatabaseModule } from '../database';
import { CommonModule } from '../common';
@Module({
  imports: [DatabaseModule, CommonModule],
  providers: [ChannelResolver, ChannelService],
  controllers: [],
  exports: [],
})
export class ChannelModule {}
