import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PriorityEnum } from 'src/enum/priority.enum';
export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  deadline: Date;

  @ApiProperty()
  @IsNotEmpty()
  priority: PriorityEnum;

  @ApiProperty()
  @IsNotEmpty()
  taskName: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;
}
