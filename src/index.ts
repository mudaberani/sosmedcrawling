import InstagramCrawler from './services/InstagramCrawler';
import TikTokCrawler from './services/TikTokCrawler';
import FileStorage from './storage/FileStorage';
import { config } from './config';
import CsvMergerService from './services/CsvMergerService';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  const storage = new FileStorage();
  const Instagram = new InstagramCrawler(storage);
  const TikTok = new TikTokCrawler(storage);

  const { isInstagram } = config.instagram;
  const { isTikTok } = config.tiktok;

  if (isInstagram) {
    const { isHashtag, isProfile } = config.instagram;

    if (isHashtag) {
      const { hashtag, totalPosts } = config.instagram;
      const instagramHashtags = hashtag.split(',');
      if (instagramHashtags.length > 0) {
        await Instagram.init();
        await Instagram.login();
        await Instagram.dismissNotNowButtons();

        for (const hashtag of instagramHashtags) {
          await Instagram.crawlHashtag(hashtag, totalPosts);

          const sourceDir = 'results/instagram/hashtags';
          const name = hashtag;
          const outputDir = `${sourceDir}/merged`;
          await CsvMergerService.mergeCsvFiles(sourceDir, name, outputDir);
          await delay(60000);
        }

        await Instagram.close();
      }
    }

    if (isProfile) {
      const { profile, totalPosts } = config.instagram;
      const instagramProfiles = profile.split(',');
      if (instagramProfiles.length > 0) {
        await Instagram.init();
        await Instagram.login();
        await Instagram.dismissNotNowButtons();

        for (const profile of instagramProfiles) {
          await Instagram.crawlProfile(profile, totalPosts);

          const sourceDir = 'results/instagram/profiles';
          const name = profile;
          const outputDir = `${sourceDir}/merged`;
          await CsvMergerService.mergeCsvFiles(sourceDir, name, outputDir);
          await delay(60000);
        }

        await Instagram.close();
      }
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
