import { chromium, Browser, Page } from 'playwright';
import { config } from '../config';
import { Storage } from '../storage';

class TikTokCrawler {
  private browser!: Browser;
  private page!: Page;
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  async init() {
    const { headless } = config.browser;
    this.browser = await chromium.launch({ headless: headless });
    const context = await this.browser.newContext();

    this.page = await context.newPage();
    await this.page.setViewportSize(config.viewport);
  }

  async crawlHashtag(hashtag: string, totalPosts: number) {
    await this.page.goto(`https://www.tiktok.com/tag/${hashtag}`);

    await this.page.waitForTimeout(10000);
    await this.page.waitForLoadState('networkidle');

    const allUrls: Set<string> = new Set();
    const totalScrolls = Math.ceil(totalPosts / 10);
    for (let i = 0; i < totalScrolls; i++) {
      const urls = await this.page.evaluate(() => {
        const links = document.querySelectorAll<HTMLAnchorElement>('div[data-e2e="challenge-item"] a');
        const urls = Array.from(links)
          .map((link) => link.href)
          .filter((url) => url.includes('/video/'));
        window.scrollBy(0, window.innerHeight);
        return urls;
      });

      urls.forEach((url) => allUrls.add(url));
      await this.page.waitForTimeout(10000);

      if ((i + 1) % 10 === 0) {
        await this.page.evaluate(() => {
          window.scrollBy(0, -1920);
        });

        this.saveToFile(hashtag, allUrls);
        allUrls.clear();
      }
    }

    if (allUrls.size > 0) {
      this.saveToFile(hashtag, allUrls);
    }
  }

  async close() {
    await this.browser.close();
  }

  private saveToFile(hashtag: string, allUrls: Set<string>) {
    this.storage.save(hashtag, allUrls);
  }
}

export default TikTokCrawler;
