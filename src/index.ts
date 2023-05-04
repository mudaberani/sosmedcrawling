import InstagramCrawler from './services/InstagramCrawler';
import FileStorage from './storage/FileStorage';

(async () => {
  const storage = new FileStorage();
  const crawler = new InstagramCrawler(storage);

  await crawler.init();
  await crawler.login();
  await crawler.dismissNotNowButtons();
  await crawler.crawlHashtag('aniesbaswedan', 100);
  await crawler.close();
})();
