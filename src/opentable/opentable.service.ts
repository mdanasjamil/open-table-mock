import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { AvailabilityResponseDto } from './dto/availability-response.dto';
import { MetadataResponseDto } from './dto/metadata-response.dto';
import { SlotLockRequestDto } from './dto/slot-lock-request.dto';
import { SlotLockResponseDto } from './dto/slot-lock-response.dto';
import { ReservationRequestDto, ReservationResponseDto } from './dto/reservation-request.dto';

// --- EMBEDDED MOCK DATA (UNCHANGED) ---
// ... (MOCK_AVAILABILITY_DATA, MOCK_METADATA_DATA, and interfaces are unchanged)

const MOCK_AVAILABILITY_DATA: any[] = [
    // existing entries for rid 101 above...
  
    {
      "rid": 101,
      "party_size": 2,
      "start_date_time": "2025-11-06T18:30:00",
      "times": ["2025-11-06T18:30:00", "2025-11-06T18:45:00", "2025-11-06T19:00:00"],
      "times_available": [
        {
          "time": "2025-11-06T18:30:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 1, "environment": "Indoor", "attributes": ["Window Seat"], "booking_url": "https://mock.opentable.com/reserve/101?time=18:30" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-06T18:45:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 1, "environment": "Indoor", "attributes": ["Corner Table"], "booking_url": "https://mock.opentable.com/reserve/101?time=18:45" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-06T19:00:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 2, "environment": "Outdoor", "attributes": ["Terrace", "Sunset View"], "booking_url": "https://mock.opentable.com/reserve/101?time=19:00" }
              ]
            }
          ]
        }
      ],
      "no_availability_reasons": [],
      "href": "https://mock.opentable.com/v2/availability/101"
    },
    {
      "rid": 101,
      "party_size": 4,
      "start_date_time": "2025-11-06T20:00:00",
      "times": ["2025-11-06T20:00:00", "2025-11-06T20:15:00", "2025-11-06T20:30:00"],
      "times_available": [
        {
          "time": "2025-11-06T20:00:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 3, "environment": "Outdoor", "attributes": ["Terrace"], "booking_url": "https://mock.opentable.com/reserve/101?time=20:00" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-06T20:15:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 3, "environment": "Outdoor", "attributes": ["Garden View"], "booking_url": "https://mock.opentable.com/reserve/101?time=20:15" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-06T20:30:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 4, "environment": "Indoor", "attributes": ["Quiet Corner"], "booking_url": "https://mock.opentable.com/reserve/101?time=20:30" }
              ]
            }
          ]
        }
      ],
      "no_availability_reasons": [],
      "href": "https://mock.opentable.com/v2/availability/101"
    },
    {
      "rid": 101,
      "party_size": 2,
      "start_date_time": "2025-11-07T19:00:00",
      "times": ["2025-11-07T19:00:00", "2025-11-07T19:15:00", "2025-11-07T19:30:00", "2025-11-07T19:45:00"],
      "times_available": [
        {
          "time": "2025-11-07T19:00:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 5, "environment": "Indoor", "attributes": ["Booth"], "booking_url": "https://mock.opentable.com/reserve/101?time=19:00" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-07T19:15:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 5, "environment": "Indoor", "attributes": ["Bar Side"], "booking_url": "https://mock.opentable.com/reserve/101?time=19:15" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-07T19:30:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 6, "environment": "Outdoor", "attributes": ["Rooftop"], "booking_url": "https://mock.opentable.com/reserve/101?time=19:30" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-07T19:45:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 7, "environment": "Outdoor", "attributes": ["Rooftop", "City View"], "booking_url": "https://mock.opentable.com/reserve/101?time=19:45" }
              ]
            }
          ]
        }
      ],
      "no_availability_reasons": [],
      "href": "https://mock.opentable.com/v2/availability/101"
    },
    {
      "rid": 101,
      "party_size": 6,
      "start_date_time": "2025-11-08T20:00:00",
      "times": ["2025-11-08T20:00:00", "2025-11-08T20:15:00", "2025-11-08T20:30:00", "2025-11-08T20:45:00"],
      "times_available": [
        {
          "time": "2025-11-08T20:00:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 8, "environment": "Private Room", "attributes": ["Chef Table"], "booking_url": "https://mock.opentable.com/reserve/101?time=20:00" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-08T20:15:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 8, "environment": "Private Room", "attributes": ["VIP"], "booking_url": "https://mock.opentable.com/reserve/101?time=20:15" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-08T20:30:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 9, "environment": "Indoor", "attributes": ["Group Table"], "booking_url": "https://mock.opentable.com/reserve/101?time=20:30" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-08T20:45:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 10, "environment": "Outdoor", "attributes": ["Garden Area"], "booking_url": "https://mock.opentable.com/reserve/101?time=20:45" }
              ]
            }
          ]
        }
      ],
      "no_availability_reasons": [],
      "href": "https://mock.opentable.com/v2/availability/101"
    },
    {
      "rid": 101,
      "party_size": 2,
      "start_date_time": "2025-11-09T18:00:00",
      "times": ["2025-11-09T18:00:00", "2025-11-09T18:15:00", "2025-11-09T18:30:00", "2025-11-09T18:45:00", "2025-11-09T19:00:00"],
      "times_available": [
        {
          "time": "2025-11-09T18:00:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 11, "environment": "Indoor", "attributes": ["Romantic Booth"], "booking_url": "https://mock.opentable.com/reserve/101?time=18:00" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-09T18:15:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 12, "environment": "Outdoor", "attributes": ["Garden View"], "booking_url": "https://mock.opentable.com/reserve/101?time=18:15" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-09T18:30:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 13, "environment": "Rooftop", "attributes": ["City View"], "booking_url": "https://mock.opentable.com/reserve/101?time=18:30" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-09T18:45:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 14, "environment": "Indoor", "attributes": ["Fireplace"], "booking_url": "https://mock.opentable.com/reserve/101?time=18:45" }
              ]
            }
          ]
        },
        {
          "time": "2025-11-09T19:00:00",
          "availability_types": [
            {
              "type": "STANDARD",
              "diningArea": [
                { "id": 15, "environment": "Outdoor", "attributes": ["Terrace", "Sunset"], "booking_url": "https://mock.opentable.com/reserve/101?time=19:00" }
              ]
            }
          ]
        }
      ],
      "no_availability_reasons": [],
      "href": "https://mock.opentable.com/v2/availability/101"
    }
  ];

  const MOCK_METADATA_DATA: any[] = [
    // existing entry above...
  
    {
      "rid": 102,
      "data": {
        "enviroments": ["Indoor", "Private Room"],
        "attributes": ["Fireplace", "Chef Table"],
        "dining_areas": [
          { "id": 3, "name": "Fireplace Lounge", "environment": "Indoor" },
          { "id": 4, "name": "Chef’s Private Table", "environment": "Private Room" }
        ]
      }
    },
    {
      "rid": 103,
      "data": {
        "enviroments": ["Rooftop", "Banquet Hall"],
        "attributes": ["City View", "Private Event"],
        "dining_areas": [
          { "id": 5, "name": "Skyline Deck", "environment": "Rooftop" },
          { "id": 6, "name": "Grand Banquet", "environment": "Banquet Hall" }
        ]
      }
    },
    {
      "rid": 104,
      "data": {
        "enviroments": ["Indoor", "Outdoor"],
        "attributes": ["Romantic Lighting", "Lake View"],
        "dining_areas": [
          { "id": 7, "name": "Candlelight Room", "environment": "Indoor" },
          { "id": 8, "name": "Lakeside Patio", "environment": "Outdoor" }
        ]
      }
    }
  ];

// --- Mock Storage for Locks and Reservations (In-memory) ---

interface MockSlotLock {
  rid: number;
  token: string;
  expires_at: Date;
  data: SlotLockRequestDto;
}
const mockSlotLocks: MockSlotLock[] = [];

interface MockReservation {
    rid: number;
    confirmation_number: string;
    status: string;
    details: ReservationRequestDto;
}
const mockReservations: MockReservation[] = [];


@Injectable()
export class OpenTableService {
  private readonly logger = new Logger(OpenTableService.name);

  // --- Availability API (Uses Array Find with Filters) ---

  /**
   * @description Fetches mock availability data, strictly filtered by rid, party_size, and exact date/time.
   */
async getAvailability(rid: number, query: AvailabilityQueryDto): Promise<AvailabilityResponseDto> {
    // 1. Access the REQUIRED ISO 8601 string from the DTO
    const fullDateTime: string = query.start_date_time;

    // 2. Extract the date (YYYY-MM-DD) using substring (first 10 characters)
    // Example: '2025-11-05T19:00:00.000Z' -> '2025-11-05'
    const reservationDate = fullDateTime.substring(0, 10);

    // 3. Extract the time (HH:MM) by finding the 'T' and taking the next 5 characters
    // Example: '2025-11-05T19:00:00.000Z' -> '19:00'
    const tIndex = fullDateTime.indexOf('T');
    // Check if 'T' exists, otherwise default time (should not happen with @IsISO8601)
    const reservationTime = tIndex !== -1 ? fullDateTime.substring(tIndex + 1, tIndex + 6) : '00:00';

    this.logger.log(`Fetching mock availability for rid=${rid} with partySize=${query.party_size} and time=${reservationDate} ${reservationTime}`);

    // 4. Construct the combined date-time string to match the mock data format (YYYY-MM-DDT HH:MM:00)
    const requestedDateTime = `${reservationDate}T${reservationTime}:00`;

    // 5. Find the mock data matching all three criteria
    // NOTE: This assumes MOCK_AVAILABILITY_DATA uses the same format as requestedDateTime
    const result = MOCK_AVAILABILITY_DATA.find(data =>
        data.rid === rid &&
        data.start_date_time === requestedDateTime
    );

    if (!result) {
        this.logger.warn(`No mock availability found for criteria: RID=${rid}, Party=${query.party_size}, Time=${requestedDateTime}`);

        // Return a not found response
        return {
            rid,
            party_size: query.party_size,
            query,
            times: [],
            times_available: [],
            no_availability_reasons: [
                'No tables available for the requested party size and time.' 
            ],
            href: `https://mock.opentable.com/v2/availability/${rid}`
        } as AvailabilityResponseDto;
    }

    // 6. Return the matched mock data
    return {
        rid,
        party_size: result.party_size,
        ...result,
        query,
    } as AvailabilityResponseDto;
  }
  // --- Metadata API (Uses Array Find) ---
    // ... (rest of the service is unchanged)
  async getMetadata(rid: number): Promise<MetadataResponseDto> {
    this.logger.log(`Fetching mock metadata for rid=${rid}`);
    const result = MOCK_METADATA_DATA.find(data => data.rid === rid) || MOCK_METADATA_DATA[0];
    return result as MetadataResponseDto;
  }

  // --- Slot Lock API (Create) ---

  async createSlotLock(
    rid: number,
    slotLockData: SlotLockRequestDto,
  ): Promise<SlotLockResponseDto> {
    this.logger.log(`Creating slot lock for rid=${rid}`);
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + 5 * 60 * 1000); // 5 minutes
    const reservation_token = `mock-token-${rid}-${Date.now()}`;

    mockSlotLocks.push({
      rid,
      token: reservation_token,
      expires_at: expiryDate,
      data: slotLockData,
    });

    return {
      expires_at: expiryDate.toISOString().replace(/\.000Z$/, ''),
      reservation_token,
    };
  }

  // --- Slot Lock API (Delete) ---

  async deleteSlotLock(rid: number, token: string): Promise<void> {
    this.logger.log(`Attempting to delete slot lock for rid=${rid} with token=${token}`);
    const index = mockSlotLocks.findIndex(lock => lock.rid === rid && lock.token === token);

    if (index !== -1) {
        mockSlotLocks.splice(index, 1);
        this.logger.log(`Slot lock deleted successfully for token: ${token}`);
    } else {
        this.logger.warn(`Slot lock not found or already expired for token: ${token}`);
    }
  }

  // --- Direct Booking/Commit API (Create Reservation) ---

  async createReservation(
    rid: number,
    reservationData: ReservationRequestDto,
  ): Promise<ReservationResponseDto> {
    const { reservation_token } = reservationData;
    this.logger.log(`Attempting to commit reservation for rid=${rid} using token=${reservation_token}`);

    // 1. Verify and consume the slot lock
    const lockIndex = mockSlotLocks.findIndex(
        lock => lock.rid === rid && lock.token === reservation_token
    );

    if (lockIndex === -1) {
        throw new BadRequestException('Invalid or expired reservation token.');
    }

    // Check expiry
    const lock = mockSlotLocks[lockIndex];
    if (lock.expires_at < new Date()) {
        mockSlotLocks.splice(lockIndex, 1); // Remove expired lock
        throw new BadRequestException('Reservation token has expired. Please restart the booking process.');
    }

    // 2. Consume the lock (remove it from the locks array)
    mockSlotLocks.splice(lockIndex, 1);

    // 3. Create the final reservation
    const confirmation_number = `CONF-${rid}-${Date.now()}`;
    const newReservation: MockReservation = {
        rid,
        confirmation_number,
        status: 'CONFIRMED',
        details: reservationData,
    };
    mockReservations.push(newReservation);
    this.logger.log(`Reservation confirmed with confirmation number: ${confirmation_number}`);

    // 4. Return the confirmation response
    return {
        rid: rid.toString(),
        confirmation_number,
        status: 'CONFIRMED',
        booked_at: new Date().toISOString(),
    };
  }
}