import InstagramCrawler from './services/InstagramCrawler';
import FileStorage from './storage/FileStorage';

(async () => {
  const storage = new FileStorage();
  const Instagram = new InstagramCrawler(storage);

  await Instagram.init();
  await Instagram.login();
  await Instagram.dismissNotNowButtons();
  await Instagram.crawlHashtag('aniesbaswedan', 1000);
  await Instagram.close();
})();
