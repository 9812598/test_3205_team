import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../app.module";
import { PrismaService } from "../prisma/prisma.service";

describe("ShortUrlController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.click.deleteMany();
    await prisma.shortUrl.deleteMany();
    await app.close();
  });

  it("should create a short link with a unique alias", async () => {
    const response = await request(app.getHttpServer()).post("/shorten").send({
      originalUrl: "https://example.com",
      alias: "custom-alias",
    });

    expect(response.status).toBe(201);
    expect(response.body.shortUrl).toContain("/custom-alias");

    const saved = await prisma.shortUrl.findUnique({
      where: { shortCode: "custom-alias" },
    });

    expect(saved).not.toBeNull();
    expect(saved?.originalUrl).toBe("https://example.com");
  });

  it("should redirect to the original URL", async () => {
    // Prepare a short link manually
    await prisma.shortUrl.create({
      data: {
        originalUrl: "https://ya.ru",
        shortCode: "redirect-alias",
      },
    });

    const response = await request(app.getHttpServer()).get("/redirect-alias");

    expect(response.status).toBe(302);
    expect(response.header["location"]).toBe("https://ya.ru");
  });
});
