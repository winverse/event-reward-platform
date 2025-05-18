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

  public async fakeAxios<T>(url: string, ...args: any[]): Promise<{ data: T }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 에러 확률 10%
          this.randomlyThrowError(0.1, '네트워크 오류가 발생했습니다');
          resolve({ data: { url, args } as T });
        } catch (error) {
          reject(error);
        }
      }, 50);
    });
  }

  public randomlyThrowError(ratio: number, message: string) {
    if (Math.random() < ratio) {
      throw new Error(message);
    }
  }
}
