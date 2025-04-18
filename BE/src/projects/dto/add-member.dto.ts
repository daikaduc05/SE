import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UpdateMemberProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;
}

export class UpdateMemberProjectDtoRequest {
  @ApiProperty({ type: [UpdateMemberProjectDto] })
  @IsNotEmpty()
  membersList: UpdateMemberProjectDto[];
}
