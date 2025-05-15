import path from 'node:path';
import fs from 'node:fs';

class CopyEnvScript {
  public execute() {
    try {
      this.createEnv();
    } catch (error: any) {
      process.exit(130); // The value is the same as the Prisma migration error code.
    }
  }

  private getEnvPath() {
    const filename = `.env.development`;
    const envFilePath = path.resolve(
      process.cwd(),
      '..',
      '..',
      'env',
      filename,
    );
    
    if (!fs.existsSync(envFilePath)) {
      throw new Error(`Not found .env.${filename} file`);
    }
    return envFilePath;
  }

  private createEnv() {
    try {
      const source = this.getEnvPath();
      const target = path.resolve(process.cwd(), '.env');
      fs.copyFileSync(source, target);
    } catch (error) {
      throw error;
    }
  }
}

const script = new CopyEnvScript();
script.execute();
