import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddMember {
  @ApiProperty()
  @IsNotEmpty()
  roleName: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;
}
