// src/subscriptions/subscriptions.controller.ts
import { Controller, Post, Body } from '@nestjs/common';

@Controller('subscriptions')
export class SubscriptionsController {
  // In produzione, memorizza le sottoscrizioni in un database
  private subscriptions: any[] = [];

  @Post()
  addSubscription(@Body() subscription: any) {
    console.log('Nuova sottoscrizione ricevuta:', subscription);
    this.subscriptions.push(subscription);
    return { message: 'Sottoscrizione aggiunta con successo' };
  }
}
