import { IsISO8601, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilityQueryDto {
  @IsISO8601()
  start_date_time: string; // required in ISO format

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  party_size?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  forward_minutes?: number;
}