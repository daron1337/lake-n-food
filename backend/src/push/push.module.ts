// src/push/push.module.ts
import { Module } from '@nestjs/common';
import { PushService } from './push.service';

@Module({
  providers: [PushService],
  exports: [PushService], // Esportalo per usarlo in altri moduli se necessario
})
export class PushModule {}
