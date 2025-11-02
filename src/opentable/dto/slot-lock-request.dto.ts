import {
  IsInt,
  IsString,
  IsISO8601,
  ValidateNested,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class PartySizePerPriceTypeDto {
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsInt()
  @Type(() => Number)
  count: number;
}

class AddOnsDto {
  @IsString()
  item_id: string;

  @IsInt()
  @Type(() => Number)
  quantity: number;
}

class ExperienceDto {
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsInt()
  @Type(() => Number)
  version: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartySizePerPriceTypeDto)
  party_size_per_price_type?: PartySizePerPriceTypeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnsDto)
  add_ons?: AddOnsDto[];
}

export class SlotLockRequestDto {
  @IsInt()
  @Type(() => Number)
  party_size: number;

  @IsISO8601()
  date_time: string; // ISO 8601 format

  @IsString()
  reservation_attribute: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExperienceDto)
  experience?: ExperienceDto;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  dining_area_id?: number;

  @IsOptional()
  @IsString()
  environment?: string;
}