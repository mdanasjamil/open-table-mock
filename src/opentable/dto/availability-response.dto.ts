export class DiningAreaDto {
  id: number;
  environment: string;
  attributes: string[];
  booking_url: string;
}

export class AvailabilityResponseDto {
  rid: number;
  party_size: number;
  times: string[];
  times_available: {
    time: string;
    availability_types: {
      type: string;
      diningArea: DiningAreaDto[];
    }[];
  }[];
  no_availability_reasons?: string[];
  href?: string;
  query?: any;
}