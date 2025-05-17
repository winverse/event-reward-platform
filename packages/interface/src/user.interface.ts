import type { UserRole } from '@packages/database';

export type LoggedUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};
