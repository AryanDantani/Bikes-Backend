import { Injectable } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  //   @Cron(CronExpression.EVERY_DAY_AT_NOON)
  handleCron() {
    // Your cron job logic goes here
    console.log('Executing cron job');
  }
}
