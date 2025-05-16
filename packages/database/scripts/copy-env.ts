import path from 'node:path';
import fs from 'node:fs';

class CopyEnvScript {
  private readonly sourceEnvFilename: string;
  private readonly targetEnvFilename: string;
  private readonly projectRoot: string;

  constructor(environment: string = 'development') {
    this.sourceEnvFilename = `.env.${environment}`;
    this.targetEnvFilename = '.env';
    this.projectRoot = process.cwd();
  }

  public execute() {
    try {
      const sourcePath = this.getSourceEnvPath();
      const targetPath = path.resolve(this.projectRoot, this.targetEnvFilename);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(
        `Successfully copied '${this.sourceEnvFilename}' to '${this.targetEnvFilename}' in '${this.projectRoot}'.`,
      );
    } catch (error: any) {
      console.error('Failed to copy .env file.', error);
      process.exit(130);
    }
  }

  private getSourceEnvPath(): string {
    const envFileDir = path.resolve(this.projectRoot, '..', '..', 'env');
    const envFilePath = path.join(envFileDir, this.sourceEnvFilename);

    if (!fs.existsSync(envFilePath)) {
      throw new Error(`Source environment file not found at: ${envFilePath}`);
    }
    return envFilePath;
  }
}

const script = new CopyEnvScript();
script.execute();