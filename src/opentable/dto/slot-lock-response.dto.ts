import { IsISO8601, IsString } from 'class-validator';

export class SlotLockResponseDto {
  @IsISO8601()
  expires_at: string; // The expiration date and time in ISO 8601 format (5 minutes from creation)

  @IsString()
  reservation_token: string; // A unique token for subsequent reservation creation
}