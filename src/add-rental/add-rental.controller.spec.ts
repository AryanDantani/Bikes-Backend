import { Test, TestingModule } from '@nestjs/testing';
import { AddRentalController } from './add-rental.controller';
import { AddRentalService } from './add-rental.service';

describe('AddRentalController', () => {
  let controller: AddRentalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddRentalController],
      providers: [AddRentalService],
    }).compile();

    controller = module.get<AddRentalController>(AddRentalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
