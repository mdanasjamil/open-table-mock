import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenTableModule } from './opentable/opentable.module'; // <-- Correct capitalization

@Module({
  imports: [OpenTableModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}