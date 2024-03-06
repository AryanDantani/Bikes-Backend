import { PartialType } from '@nestjs/mapped-types';
import { CreateAddRentalDto } from './create-add-rental.dto';

export class UpdateAddRentalDto extends PartialType(CreateAddRentalDto) {}
