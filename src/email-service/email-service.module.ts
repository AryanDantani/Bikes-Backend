import { Module } from '@nestjs/common';
import { EmailController } from './email-service.controller';
import { EmailService } from './email-service.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailServiceModule {}
