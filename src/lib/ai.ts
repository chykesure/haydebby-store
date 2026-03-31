import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const loadConfig = async () => {
  const homeDir = os.homedir();
  const configPaths = [
    path.join(process.cwd(), '.z-ai-config'),
    path.join(homeDir, '.z-ai-config'),
    '/etc/.z-ai-config'
  ];
  for (const filePath of configPaths) {
    try {
      const configStr = await fs.readFile(filePath, 'utf-8');
      const config = JSON.parse(configStr);
      if (config.baseUrl && config.apiKey) {
        return config;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Error reading config at ${filePath}:`, error);
      }
    }
  }
  throw new Error('AI config not found');
};

export async function createZAI(requestToken?: string) {
  const config = await loadConfig();
  // Merge the token from incoming request headers
  if (requestToken) {
    config.token = requestToken;
  }
  return new ZAI(config) as ReturnType<typeof ZAI.create> extends Promise<infer T> ? T : never;
}
