import { Test, TestingModule } from '@nestjs/testing';
import { OpentableController } from './opentable.controller';

describe('OpentableController', () => {
  let controller: OpentableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpentableController],
    }).compile();

    controller = module.get<OpentableController>(OpentableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
