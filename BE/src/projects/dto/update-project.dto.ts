import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { CreateProjectDto } from './create-project.dto';
export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  endDate: Date;
}
