﻿import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return 'Hello from Nest + Docker + Prisma!';
  }
}
