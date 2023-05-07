import fs from 'fs';
import path from 'path';
import { Storage } from './index';
import InstagramDetailService from '../services/InstagramDetailService';

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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async save(platform: string, category: string, name: string, urls: Set<string>): Promise<string> {
    const deduplicatedUrls = this.removeDuplicateUrls(urls);
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const dirPath = path.join(this.baseDir, platform, category);

    this.createDirectoryIfNotExists(dirPath);

    const filePath = path.join(dirPath, `${name}_${timestamp}.csv`);
    const file = fs.createWriteStream(filePath, {
      flags: 'a',
    });

    file.write('id,code,taken_at,image_url,username,like_count,view_count,comment_count,url_post\n');

    let id = 1;
    for (const url of deduplicatedUrls) {
      const InstagramDetail = new InstagramDetailService();
      const response = await InstagramDetail.getPostDetail(url);
      const post = response.data.xdt_api__v1__media__shortcode__web_info.items[0];

      let imageUrl: string | null = null;
      if (post.carousel_media) {
        const carouselImage = post.carousel_media[0].image_versions2.candidates.find(
          (candidate: any) => candidate.height === post.carousel_media[0].original_height
        );
        if (carouselImage) {
          imageUrl = carouselImage.url;
        }
      } else if (post.image_versions2) {
        const image = post.image_versions2.candidates.find(
          (candidate: any) => candidate.height === post.original_height
        );
        if (image) {
          imageUrl = image.url;
        } else {
          imageUrl = post.image_versions2.candidates[0]?.url || null;
        }
      }

      const takenAtDate = new Date(post.taken_at * 1000);
      const formattedTakenAt = this.formatDate(takenAtDate);

      const detailPost = {
        code: post.code,
        taken_at: formattedTakenAt,
        image_url: imageUrl,
        username: post.user.username,
        like_count: post.like_count,
        view_count: post.view_count,
        comment_count: post.comment_count,
        url_post: `https://www.instagram.com/p/${post.code}/`,
      }

      const row = `${id},${detailPost.code},${detailPost.taken_at},${detailPost.image_url},${detailPost.username},${detailPost.like_count},${detailPost.view_count},${detailPost.comment_count},${detailPost.url_post}\n`;
      file.write(row);
      id++;
    }

    file.end();

    return filePath;
  }
}

export default FileStorage;
