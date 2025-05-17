import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@packages/database';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
