import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class UserSignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string = '';

  @ApiProperty()
  @IsEmail()
  email: string = '';

  @ApiProperty()
  @IsNotEmpty()
  password: string = '';
}
