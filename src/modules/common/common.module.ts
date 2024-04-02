import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
@Module({
  imports: [TerminusModule],
  providers: [],
  exports: [],
})
export class CommonModule {}
