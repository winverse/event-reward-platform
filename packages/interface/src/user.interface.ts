import { UserRole } from '@packages/database/generated';

export type LoggedUser = {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
};
