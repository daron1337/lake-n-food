// src/subscriptions/subscriptions.module.ts
import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';

@Module({
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
