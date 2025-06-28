import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";

export class CreateShortUrlDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  alias?: string;

  @IsOptional()
  expiresAt?: Date;
}
