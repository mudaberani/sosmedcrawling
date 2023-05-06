import fs from 'fs';
import path from 'path';
import { Storage } from './index';

class FileStorage implements Storage {
  private baseDir: string;

  constructor() {
    this.baseDir = 'results';
    this.createDirectoryStructure();
  }

  private removeDuplicateUrls(urls: Set<string>): Set<string> {
    return new Set(Array.from(urls));
  }

  private createDirectoryStructure(): void {
    const platforms = ['instagram', 'tiktok'];
    const categories = ['hashtags', 'profiles'];

    this.createDirectoryIfNotExists(this.baseDir);

    platforms.forEach((platform) => {
      const platformPath = path.join(this.baseDir, platform);
      this.createDirectoryIfNotExists(platformPath);

      categories.forEach((category) => {
        const categoryPath = path.join(platformPath, category);
        this.createDirectoryIfNotExists(categoryPath);
      });
    });
  }

  private createDirectoryIfNotExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  }

  private getPostIdFromUrl(url: string): string {
    let postId = '';

    if (url.includes('instagram.com')) {
      const postIdMatch = url.match(/\/p\/([^/]+)\//);
      postId = postIdMatch ? postIdMatch[1] : '';
    } else if (url.includes('tiktok.com')) {
      const postIdMatch = url.match(/video\/(\d+)/);
      postId = postIdMatch ? postIdMatch[1] : '';
    }

    return postId;
  }

  save(platform: string, category: string, name: string, urls: Set<string>): string {
    const deduplicatedUrls = this.removeDuplicateUrls(urls);
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const dirPath = path.join(this.baseDir, platform, category);

    // Ensure the directory exists
    this.createDirectoryIfNotExists(dirPath);

    const filePath = path.join(dirPath, `${name}_${timestamp}.csv`);
    const file = fs.createWriteStream(filePath, {
      flags: 'a',
    });

    // Write the header row
    file.write('id,url,post_id\n');

    // Write the data rows
    let id = 1;
    deduplicatedUrls.forEach((url) => {
      const postId = this.getPostIdFromUrl(url);
      const row = `${id},${url},${postId}\n`;
      file.write(row);
      id++;
    });

    file.end();

    return filePath;
  }
}

export default FileStorage;
