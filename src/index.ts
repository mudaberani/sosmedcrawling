import InstagramCrawler from './services/InstagramCrawler';
import TikTokCrawler from './services/TikTokCrawler';
import FileStorage from './storage/FileStorage';
import { config } from './config';
import CsvMergerService from './services/CsvMergerService';

(async () => {
  const storage = new FileStorage();
  const Instagram = new InstagramCrawler(storage);
  const TikTok = new TikTokCrawler(storage);

  const { isInstagram } = config.instagram;
  const { isTikTok } = config.tiktok;

  if (isInstagram) {
    const { isHashtag } = config.instagram;

    if (isHashtag) {
      const { hashtag, totalPosts } = config.instagram;
      await Instagram.init();
      await Instagram.login();
      await Instagram.dismissNotNowButtons();
      await Instagram.crawlHashtag(hashtag, totalPosts);
      await Instagram.close();

      const sourceDir = 'results/instagram/hashtags';
      const name = hashtag;
      const outputDir = `${sourceDir}/merged`;
      await CsvMergerService.mergeCsvFiles(sourceDir, name, outputDir);
    }
  }

  if (isTikTok) {
    const { isHashtag } = config.tiktok;

    if (isHashtag) {
      const { hashtag, totalPosts } = config.tiktok;
      await TikTok.init();
      await TikTok.crawlHashtag(hashtag, totalPosts);
      await TikTok.close();
    }
  }
})();
