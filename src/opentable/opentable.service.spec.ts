import { Test, TestingModule } from '@nestjs/testing';
import { OpentableService } from './opentable.service';

describe('OpentableService', () => {
  let service: OpentableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpentableService],
    }).compile();

    service = module.get<OpentableService>(OpentableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
