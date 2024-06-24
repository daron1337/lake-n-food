import { Controller, Get, Post, HttpCode, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrdersController {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private eventsGateway: EventsGateway,
  ) {}

  @Post()
  @HttpCode(201)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.number = createOrderDto.number;
    const savedOrder = await this.ordersRepository.save(order);
    this.eventsGateway.server.emit('orderSaved', savedOrder); // Emit event after saving
    return savedOrder;
  }

  // New GET endpoint to retrieve all orders
  @Get()
  async findAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find();
  }
}
