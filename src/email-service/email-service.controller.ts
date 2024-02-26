import { Controller } from '@nestjs/common';
import { EmailService } from './email-service.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
