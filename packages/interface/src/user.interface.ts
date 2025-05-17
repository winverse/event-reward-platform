import type { UserRole, User } from '@packages/database';

export type LoggedUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};

export type SafeUser = Omit<User, 'password'>;