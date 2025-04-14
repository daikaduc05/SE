import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AssignTask {
  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
