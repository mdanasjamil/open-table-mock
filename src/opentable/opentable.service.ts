import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AvailabilityQueryDto } from './dto/availability-query.dto';
import { AvailabilityResponseDto } from './dto/availability-response.dto';
import { MetadataResponseDto } from './dto/metadata-response.dto';
import { SlotLockRequestDto } from './dto/slot-lock-request.dto';
import { SlotLockResponseDto } from './dto/slot-lock-response.dto';
import { ReservationRequestDto, ReservationResponseDto } from './dto/reservation-request.dto';

// --- EMBEDDED MOCK DATA (UNCHANGED) ---
// ... (Interfaces are unchanged)

const MOCK_AVAILABILITY_DATA: any[] = [
    // ... (Assuming other entries like rid 101 are here)
    {
      "rid": 1038007,
      "party_size": 2,
      "restaurant_settings": {
        "scc_enabled": true
      },
      "times": [
        "2025-11-10T12:45",
        "2025-11-10T13:00",
        "2025-11-10T13:15"
      ],
      "times_available": [
        {
          "time": "2025-11-10T12:45",
          "availability_types": [
            {
              "type": "Standard",
              "diningArea": [
                {
                  "id": 1,
                  "table_type": [
                    "default",
                    "outdoor"
                  ]
                }
              ]
            },
            {
              "type": "Experience",
              "diningArea": [
                {
                  "id": 1,
                  "table_type": [
                    "default"
                  ],
                  "experience_ids": [
                    480995
                  ]
                },
                {
                  "id": 1,
                  "table_type": [
                    "outdoor"
                  ],
                  "experience_ids": [
                    480995
                  ]
                }
              ],
              "experienceCancellationPolicy": [
                {
                  "experienceId": 480995,
                  "type": "Hold",
                  "id": "681a0cc3731b95b6c4dd1aa1:v1"
                }
              ]
            }
          ]
        },
        {
          "time": "2025-11-10T13:00",
          "availability_types": [
            {
              "type": "Standard",
              "diningArea": [
                {
                  "id": 1,
                  "table_type": [
                    "default",
                    "outdoor"
                  ]
                }
              ]
            },
            {
              "type": "Experience",
              "diningArea": [
                {
                  "id": 1,
                  "table_type": [
                    "default"
                  ],
                  "experience_ids": [
                    480995
                  ]
                },
                {
                  "id": 1,
                  "table_type": [
                    "outdoor"
                  ],
                  "experience_ids": [
                    480995
                  ]
                }
              ],
              "experienceCancellationPolicy": [
                {
                  "experienceId": 480995,
                  "type": "Hold",
                  "id": "681a0cc3731b95b6c4dd1aa1:v1"
                }
              ]
            }
          ]
        },
        {
          "time": "2025-11-10T13:15",
          "availability_types": [
            {
              "type": "Standard",
              "diningArea": [
                {
                  "id": 1,
                  "table_type": [
                    "default",
                    "outdoor"
                  ]
                }
              ]
            },
            {
              "type": "Experience",
              "diningArea": [
                {
                  "id": 1,
                  "table_type": [
                    "default"
                  ],
                  "experience_ids": [
                    480995
                  ]
                },
                {
                  "id": 1,
                  "table_type": [
                    "outdoor"
                  ],
                  "experience_ids": [
                    480995
                  ]
                }
              ],
              "experienceCancellationPolicy": [
                {
                  "experienceId": 480995,
                  "type": "Hold",
                  "id": "681a0cc3731b95b6c4dd1aa1:v1"
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const MOCK_METADATA_DATA: any[] = [
    // ... (existing entry for rid 101 assumed here)
 
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
   * @description Fetches mock availability data, filtered *only* by rid and party_size. Ignores time.
   */
  async getAvailability(rid: number, query: AvailabilityQueryDto): Promise<AvailabilityResponseDto> {
    
    this.logger.log(`Fetching mock availability for rid=${rid} with partySize=${query.party_size}. Ignoring time filter.`);

    // 1. Find the mock data block that matches RID and PARTY SIZE.
    const restaurantAvailabilityBlock = MOCK_AVAILABILITY_DATA.find(data =>
        data.rid === rid &&
        data.party_size === query.party_size
    );

    // 2. If no block matches rid/party_size, return "no availability"
    if (!restaurantAvailabilityBlock) {
        this.logger.warn(`No availability block found for: RID=${rid}, Party=${query.party_size}`);
        return this.getNoAvailabilityResponse(rid, query);
    }
    
    // 3. Return the *entire* found block without checking the time.
    this.logger.log(`Found availability block. Returning all available times for RID=${rid}, Party=${query.party_size}`);
    return {
        rid,
        party_size: restaurantAvailabilityBlock.party_size,
        ...restaurantAvailabilityBlock, // Spread the entire found block
        query,
    } as AvailabilityResponseDto;
  }

  /**
   * @description Helper function to generate a standard "No Availability" response.
   */
  private getNoAvailabilityResponse(rid: number, query: AvailabilityQueryDto): AvailabilityResponseDto {
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


  // --- Metadata API (Uses Array Find) ---
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