import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { EventsGateway } from '../events/events.gateway';
import { PushModule } from '../push/push.module';

@Module({
  imports: [PushModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService, EventsGateway],
})
export class OrdersModule {}
