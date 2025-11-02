import { Module } from '@nestjs/common';
import { OpenTableController } from './opentable.controller';
import { OpenTableService } from './opentable.service';

@Module({
  controllers: [OpenTableController],
  providers: [OpenTableService],
})
export class OpenTableModule {}