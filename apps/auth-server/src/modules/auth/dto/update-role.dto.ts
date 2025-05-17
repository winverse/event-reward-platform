import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@packages/database';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
