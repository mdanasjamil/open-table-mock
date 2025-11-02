import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  ParseIntPipe,
  Logger,
  UsePipes,
  ValidationPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { OpenTableService } from './opentable.service';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { SlotLockRequestDto } from './dto/slot-lock-request.dto';
import { ReservationRequestDto, ReservationResponseDto } from './dto/reservation-request.dto';

@Controller('opentable')
export class OpenTableController {
  private readonly logger = new Logger(OpenTableController.name);

  constructor(private readonly openTableService: OpenTableService) {}

  // --- Availability API (GET) ---

  @Get('availability/:rid')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAvailability(
    @Param('rid', ParseIntPipe) rid: number,
    @Query() query: AvailabilityQueryDto,
  ) {
    this.logger.log(`GET /opentable/availability/${rid}`);
    return this.openTableService.getAvailability(rid, query);
  }

  // --- Metadata API (GET) ---

  @Get('availability-metadata/:rid')
  async getMetadata(@Param('rid', ParseIntPipe) rid: number) {
    this.logger.log(`GET /opentable/availability-metadata/${rid}`);
    return this.openTableService.getMetadata(rid);
  }

  // --- Slot Lock API (POST: Step 1 - Hold Slot) ---

  @Post('v2/booking/:rid/slot_locks')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSlotLock(
    @Param('rid', ParseIntPipe) rid: number,
    @Body() slotLockData: SlotLockRequestDto,
  ) {
    this.logger.log(`POST /opentable/v2/booking/${rid}/slot_locks`);
    return this.openTableService.createSlotLock(rid, slotLockData);
  }

  // --- Slot Lock API (DELETE) ---

  @Delete('v2/booking/:rid/slot_locks/:reservation_token')
  @HttpCode(204) // 204 No Content on successful deletion
  async deleteSlotLock(
    @Param('rid', ParseIntPipe) rid: number,
    @Param('reservation_token') token: string,
  ) {
    this.logger.log(`DELETE /opentable/v2/booking/${rid}/slot_locks/${token}`);
    await this.openTableService.deleteSlotLock(rid, token);
  }

  // --- Direct Booking/Commit API (POST: Step 2 - Confirm Reservation) ---

  @Post('v2/booking/:rid/reservations')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createReservation(
    @Param('rid', ParseIntPipe) rid: number,
    @Body() reservationData: ReservationRequestDto,
  ): Promise<ReservationResponseDto> {
    this.logger.log(`POST /opentable/v2/booking/${rid}/reservations`);
    return this.openTableService.createReservation(rid, reservationData);
  }
}