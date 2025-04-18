import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
export class UserUpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  notiSettings: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isBanned: boolean;
}
