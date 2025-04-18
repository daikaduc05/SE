import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AssignTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  emails: string[];
}
