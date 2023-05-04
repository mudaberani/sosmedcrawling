import InstagramCrawler from './services/InstagramCrawler';
import FileStorage from './storage/FileStorage';
import { config } from './config';

(async () => {
  const storage = new FileStorage();
  const Instagram = new InstagramCrawler(storage);
  const { isInstagram } = config.instagram;

  if (isInstagram) {
    const { isHashtag } = config.instagram;

    if (isHashtag) {
      const { hashtag, totalPosts } = config.instagram;
      await Instagram.init();
      await Instagram.login();
      await Instagram.dismissNotNowButtons();
      await Instagram.crawlHashtag(hashtag, totalPosts);
      await Instagram.close();
    }
  }
})();
