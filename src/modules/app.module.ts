import { Module } from '@nestjs/common';
import { ChannelInitializationService } from './channel.init.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ChannelInitializationService],
})
export class ApplicationModule {}
