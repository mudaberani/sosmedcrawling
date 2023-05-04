import dotenv from 'dotenv';

dotenv.config();

export const config = {
  instagram: {
    username: process.env.INSTAGRAM_USERNAME!,
    password: process.env.INSTAGRAM_PASSWORD!,
  },
  viewport: {
    width: 1920,
    height: 1080,
  },
};
