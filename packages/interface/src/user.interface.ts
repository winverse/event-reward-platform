import type { UserRole } from '@packages/database';

export type LoggedUser = {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
};
