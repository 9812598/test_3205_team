import { Module } from "@nestjs/common";
import { ShortUrlModule } from "./short-url/short-url.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [ShortUrlModule, PrismaModule],
})
export class AppModule {}
