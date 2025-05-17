import { LoggedUser } from '@packages/interface';

type JwtDefault = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
};

export type AccessTokenDecoded = { user: LoggedUser } & JwtDefault;
export type RefreshTokenDecoded = { userId: string } & JwtDefault;
