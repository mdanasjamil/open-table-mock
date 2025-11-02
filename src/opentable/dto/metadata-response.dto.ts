export class DiningAreaMetaDto {
  id: number;
  name: string;
  environment: string;
  description?: string;
}

export class MetadataResponseDto {
  data: {
    enviroments: string[];
    attributes: string[];
    dining_areas: DiningAreaMetaDto[];
  };
}