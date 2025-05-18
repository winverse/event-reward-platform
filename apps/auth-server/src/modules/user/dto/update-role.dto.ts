import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@packages/database';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
