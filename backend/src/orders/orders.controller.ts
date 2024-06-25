import { Controller, Get, Post, Delete, HttpCode, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private eventsGateway: EventsGateway,
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @HttpCode(201)
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.number = createOrderDto.number;
    const savedOrder = await this.ordersRepository.save(order);
    // add createdAtRome property to the savedOrder object
    const orderData = {
      id: order.id,
      number: order.number,
      createdAt: order.createdAt,
      createdAtRome: order.createdAtRome, // Using the getter to format the timestamp
    };
    this.eventsGateway.server.emit('orderSaved', orderData); // Emit event after saving
    return savedOrder;
  }

  // New GET endpoint to retrieve all orders
  @Get()
  async findAllOrders(): Promise<Order[]> {
    const orders = await this.ordersRepository.find({
      order: {
        createdAt: 'DESC', // This sorts by the UTC datetime directly from the database
      },
    });
    return orders.map((order) => ({
      id: order.id,
      number: order.number,
      createdAtRome: order.createdAtRome, // Use the getter to format
      createdAt: order.createdAt, // Add the missing createdAt property
    }));
  }
  @Delete()
  @HttpCode(204)
  async clearOrders(): Promise<void> {
    await this.ordersService.clearOrders();
    this.eventsGateway.server.emit('ordersCleared');
  }
}
