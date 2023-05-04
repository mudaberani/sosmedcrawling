import fs from 'fs';
import path from 'path';
import { Storage } from './index';

class FileStorage implements Storage {
  private baseDir: string;

  private removeDuplicateUrls(urls: Set<string>): Set<string> {
    return new Set(Array.from(urls));
  }

  constructor() {
    this.baseDir = 'results';
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir);
    }
  }

  save(hashtag: string, urls: Set<string>): void {
    const deduplicatedUrls = this.removeDuplicateUrls(urls);
    const filePath = path.join(this.baseDir, `${hashtag}.txt`);
    const file = fs.createWriteStream(filePath, {
      flags: 'a',
    });

    deduplicatedUrls.forEach((url) => file.write(url + '\n'));
    file.end();
  }
}

export default FileStorage;
