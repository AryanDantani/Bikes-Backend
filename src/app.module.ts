import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModelsModule } from './schemas/mongoose-models.module';
import { UsersModule } from './users/users.module';
import { RentalModule } from './rental/rental.module';
import { CategoryModule } from './category/category.module';
import { BikeModule } from './bike/bike.module';
import { EmailServiceModule } from './email-service/email-service.module';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE),
    UsersModule,
    MongooseModelsModule,
    RentalModule,
    CategoryModule,
    BikeModule,
    EmailServiceModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
