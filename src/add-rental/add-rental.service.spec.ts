import { Test, TestingModule } from '@nestjs/testing';
import { AddRentalService } from './add-rental.service';

describe('AddRentalService', () => {
  let service: AddRentalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddRentalService],
    }).compile();

    service = module.get<AddRentalService>(AddRentalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
