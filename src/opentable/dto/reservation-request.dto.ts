import { IsString, IsEmail, IsOptional, IsISO8601 } from 'class-validator';
import { SlotLockRequestDto } from './slot-lock-request.dto'; 

// --- Response DTO ---
export class ReservationResponseDto {
  @IsString()
  confirmation_number: string;
  
  @IsString()
  status: string; // e.g., "CONFIRMED"

  @IsString()
  rid: string;

  @IsISO8601()
  booked_at: string;
}

// --- Request DTO (extends the lock data) ---
export class ReservationRequestDto extends SlotLockRequestDto {
  @IsString()
  reservation_token: string; // The token obtained from the slot lock

  @IsString()
  guest_first_name: string;

  @IsString()
  guest_last_name: string;

  @IsEmail()
  guest_email: string;

  @IsString()
  @IsOptional()
  guest_phone?: string;
}