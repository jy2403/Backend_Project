import { Injectable } from '@nestjs/common';
import { Twilio} 

@Injectable()
export class NotificationsService {
  getHello(): string {
    return 'Hello World!';
  }
}
