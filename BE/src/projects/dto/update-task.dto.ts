import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Priority } from 'src/enum/priority.enum';
import { State } from 'src/enum/state.enum';
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  taskState?: State;

  @ApiPropertyOptional()
  deadline?: Date;

  @ApiPropertyOptional()
  priority?: Priority;

  @ApiPropertyOptional()
  taskName?: Priority;
}
