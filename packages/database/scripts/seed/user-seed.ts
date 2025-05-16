import { UserRole } from '../../src/generated/mongo/client.js';

export const usersSeed = [
  {
    email: 'user@nexon.com',
    username: 'happyUser',
    password: 'password123',
    role: UserRole.USER,
  },
  {
    email: 'operator@nexon.com',
    username: 'eventOperator',
    password: 'password123',
    role: UserRole.OPERATOR,
  },
  {
    email: 'auditor@nexon.com',
    username: 'auditUser',
    password: 'password123',
    role: UserRole.AUDITOR,
  },
  {
    email: 'admin@nexon.com',
    username: 'superAdmin',
    password: 'password123',
    role: UserRole.ADMIN,
  },
];
