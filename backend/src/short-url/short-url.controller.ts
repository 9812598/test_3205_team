import {
  Body,
  Controller,
  Get,
  Delete,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { ShortUrlService } from "./short-url.service";
import { Response, Request } from "express";
import { CreateShortUrlDto } from "./dto/create-short-url.dto";

@Controller()
export class ShortUrlController {
  constructor(private readonly service: ShortUrlService) {}

  @Post("shorten")
  create(@Body() dto: CreateShortUrlDto) {
    return this.service.create(dto);
  }

  @Get(":shortCode")
  async redirect(
    @Param("shortCode") shortCode: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      "";
    const originalUrl = await this.service.registerClick(
      shortCode,
      ip as string
    );
    if (!originalUrl) {
      throw new NotFoundException("Short URL not found or expired");
    }
    return res.redirect(originalUrl);
  }

  @Get("analytics/:shortCode")
  async analytics(@Param("shortCode") shortCode: string) {
    const analytics = await this.service.getAnalytics(shortCode);
    if (!analytics) {
      throw new NotFoundException("Short URL not found");
    }
    return analytics;
  }

  @Get("info/:shortCode")
  async info(@Param("shortCode") shortCode: string) {
    const info = await this.service.getInfo(shortCode);
    if (!info) {
      throw new NotFoundException("Short URL not found");
    }
    return info;
  }

  @Delete("delete/:shortUrl")
  async deleteShortUrl(@Param("shortUrl") shortUrl: string) {
    const deleted = await this.service.deleteByShortCode(shortUrl);
    if (!deleted) {
      throw new NotFoundException("Short URL not found");
    }
    return { message: "Short URL deleted successfully" };
  }
}
