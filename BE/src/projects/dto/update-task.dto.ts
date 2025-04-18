import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PriorityEnum } from 'src/enum/priority.enum';
import { StateEnum } from 'src/enum/state.enum';
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  state?: StateEnum;

  @ApiPropertyOptional()
  deadline?: Date;

  @ApiPropertyOptional()
  priority?: PriorityEnum;

  @ApiPropertyOptional()
  taskName?: string;

  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  doneAt?: Date;
}
