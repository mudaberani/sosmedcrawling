import dotenv from 'dotenv';

dotenv.config();

export const config = {
  instagram: {
    isInstagram: process.env.IS_INSTAGRAM === 'true',
    username: process.env.INSTAGRAM_USERNAME!,
    password: process.env.INSTAGRAM_PASSWORD!,
    profile: process.env.INSTAGRAM_PROFILE!,
    hashtag: process.env.INSTAGRAM_HASHTAG!,
    totalPosts: Number(process.env.INSTAGRAM_TOTAL_POSTS!),
    isProfile: process.env.INSTAGRAM_IS_PROFILE === 'true',
    isHashtag: process.env.INSTAGRAM_IS_HASHTAG === 'true',
  },
  viewport: {
    width: 1920,
    height: 1080,
  },
  browser: {
    headless: process.env.BROWSER_HEADLESS === 'true',
  },
};
