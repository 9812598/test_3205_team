import { Module } from '@nestjs/common';
import { ShortUrlController } from './short-url.controller';
import { ShortUrlService } from './short-url.service';

@Module({
  controllers: [ShortUrlController],
  providers: [ShortUrlService]
})
export class ShortUrlModule {}
