import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class UtilsService {
  saltRounds = 10;

  public async hashPassword(password: string) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  public async comparePassword(password: string, hashed: string) {
    return await bcrypt.compare(password, hashed);
  }

  public async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
