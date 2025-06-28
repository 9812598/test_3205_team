import { Injectable, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateShortUrlDto } from "./dto/create-short-url.dto";
import { nanoid } from "nanoid";

@Injectable()
export class ShortUrlService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateShortUrlDto) {
    const shortCode = dto.alias?.trim() || nanoid(6);
    const existing = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (existing) {
      throw new ConflictException(
        "This alias already taken please choose another one"
      );
    }

    try {
      const short = await this.prisma.shortUrl.create({
        data: {
          originalUrl: dto.originalUrl,
          shortCode,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        },
      });

      return {
        shortUrl: `${process.env.BASE_URL || "http://localhost:3002"}/${
          short.shortCode
        }`,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    const record = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!record || (record.expiresAt && record.expiresAt < new Date())) {
      return null;
    }

    return record.originalUrl;
  }

  async deleteByShortCode(shortCode: string) {
    try {
      return await this.prisma.shortUrl.delete({
        where: { shortCode },
      });
    } catch (e) {
      return null;
    }
  }

  async registerClick(shortCode: string, ipAddress?: string) {
    const short = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!short) return null;

    await this.prisma.click.create({
      data: {
        shortUrlId: short.id,
        ipAddress: ipAddress || "unknown",
      },
    });

    return short.originalUrl;
  }

  async getAnalytics(shortCode: string) {
    const short = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!short) return null;

    const clickCount = await this.prisma.click.count({
      where: { shortUrlId: short.id },
    });

    const lastClicks = await this.prisma.click.findMany({
      where: { shortUrlId: short.id },
      orderBy: { clickedAt: "desc" },
      take: 5,
      select: { ipAddress: true },
    });

    return {
      clickCount,
      lastIps: lastClicks.map((click) => click.ipAddress ?? "unknown"),
    };
  }

  async getInfo(shortCode: string) {
    const short = await this.prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!short) return null;

    const clickCount = await this.prisma.click.count({
      where: { shortUrlId: short.id },
    });

    return {
      originalUrl: short.originalUrl,
      createdAt: short.createdAt,
      clickCount,
    };
  }
}
