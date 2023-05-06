import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../config';

const { fbDtsg, cookie } = config.instagram;

class InstagramDetailService {
  async getPostDetail(postLink: string) {
    const shortCodeMatch = postLink.match(/\/p\/([^/]+)\//);
    const shortcode = shortCodeMatch ? shortCodeMatch[1] : '';
    try {
      const options: AxiosRequestConfig = {
        method: 'POST',
        url: 'https://www.instagram.com/api/graphql',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cookie': `${cookie}`,
          'Origin': 'https://www.instagram.com',
          'Referer': `https://www.instagram.com/p/${shortcode}/`,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'X-Requested-With': 'XMLHttpRequest'
        },
        data: `fb_dtsg=${fbDtsg}&variables={"shortcode":"${shortcode}"}&server_timestamps=true&doc_id=6607668382629907`
      };

      const response = await axios(options);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default InstagramDetailService;
