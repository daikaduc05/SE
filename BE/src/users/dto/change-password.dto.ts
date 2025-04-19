import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class ChangePasswordDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  oldPassword: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  newPassword: string;
}
