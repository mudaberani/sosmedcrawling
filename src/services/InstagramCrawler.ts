import { chromium, Browser, Page } from 'playwright';
import { config } from '../config';
import { Storage } from '../storage';

class InstagramCrawler {
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

  async login() {
    const { username, password } = config.instagram;

    await this.page.goto('https://www.instagram.com/accounts/login/');
    await this.page.waitForSelector('input[name="username"]', {
      timeout: 5000,
    });

    await this.page.type('input[name="username"]', username);
    await this.page.waitForTimeout(Math.floor(Math.random() * 4000) + 1000);
    await this.page.type('input[name="password"]', password);
    await this.page.waitForTimeout(Math.floor(Math.random() * 4000) + 1000);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation();
  }

  async dismissNotNowButtons() {
    const notNowButton1 = await this.page.$('div[role="button"]:has-text("Not Now")');
    if (notNowButton1) {
      await notNowButton1.click();
    }

    await this.page.waitForTimeout(Math.floor(Math.random() * 4000) + 1000);

    const notNowButton2 = await this.page.$('button:has-text("Not Now")');
    if (notNowButton2) {
      await notNowButton2.click();
    }

    await this.page.waitForTimeout(Math.floor(Math.random() * 4000) + 1000);
  }

  async crawlHashtag(hashtag: string, totalPosts: number) {
    await this.page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`);

    await this.page.waitForTimeout(Math.floor(Math.random() * 4000) + 1000);
    await this.page.waitForLoadState('networkidle');

    const allUrls: Set<string> = new Set();
    const totalScrolls = Math.ceil(totalPosts / 10);
    for (let i = 0; i < totalScrolls; i++) {
      const urls = await this.page.evaluate(() => {
        const links = document.querySelectorAll<HTMLAnchorElement>('article a');
        const urls = Array.from(links).map((link) => link.href);
        window.scrollBy(0, window.innerHeight);
        return urls;
      });

      urls.forEach((url) => allUrls.add(url));
      await this.page.waitForTimeout(10000);

      if ((i + 1) % 10 === 0) {
        await this.page.evaluate(() => {
          window.scrollBy(0, -1920);
        });

        this.saveToFile('hashtags', hashtag, allUrls);
        allUrls.clear();
      }
    }

    if (allUrls.size > 0) {
      this.saveToFile('hashtags', hashtag, allUrls);
    }
  }

  async crawlProfile(username: string, totalPosts: number) {
    await this.page.goto(`https://www.instagram.com/${username}/`);

    await this.page.waitForTimeout(Math.floor(Math.random() * 4000) + 1000);
    await this.page.waitForLoadState('networkidle');

    const allUrls: Set<string> = new Set();
    const totalScrolls = Math.ceil(totalPosts / 10);
    for (let i = 0; i < totalScrolls; i++) {
      const urls = await this.page.evaluate(() => {
        const links = document.querySelectorAll<HTMLAnchorElement>('article a');
        const urls = Array.from(links).map((link) => link.href);
        window.scrollBy(0, window.innerHeight);
        return urls;
      });

      urls.forEach((url) => allUrls.add(url));
      await this.page.waitForTimeout(Math.floor(Math.random() * 4000) + 1000);

      if ((i + 1) % 10 === 0) {
        await this.page.evaluate(() => {
          window.scrollBy(0, -1920);
        });

        this.saveToFile('profiles', username, allUrls);
        allUrls.clear();
      }
    }

    if (allUrls.size > 0) {
      this.saveToFile('profiles', username, allUrls);
    }
  }

  async close() {
    await this.browser.close();
  }

  private saveToFile(category: string, hashtag: string, allUrls: Set<string>) {
    this.storage.save('instagram', category, hashtag, allUrls);
  }
}

export default InstagramCrawler;
