import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../config';

const { fbDtsg } = config.instagram;

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
          'Cookie': 'ig_nrcb=1; mid=Y5v2sAALAAGIsG5hZW-K6Lliyi91; ig_did=E3D94F35-5C05-4627-8DC5-730FA5063AF7; fbm_124024574287414=base_domain=.instagram.com; datr=9CrKY2-PIDwh7Ywt3Wne3tIR; shbid="18586\\054293078538\\0541714440192:01f78f5572d53184e980b575f1b69b5366fa91e1f0d3200aa06359b466fd90e1fae35a13"; shbts="1682904192\\054293078538\\0541714440192:01f7dc746a302398e4a2cd0fc5e44f1243103909cf496c6367a971f97866d237272a5e90"; csrftoken=UsiWRcvn3K4nbkICHNL3VAkaAlCjAHYG; ds_user_id=59052490745; sessionid=59052490745%3AEO67cVrJOhmveG%3A3%3AAYfhfE9yYU8mUsV6Xfk-Y8wl7LyXwBW9NIAz9BLLcw; rur="CCO\\05459052490745\\0541714670505:01f75b107be02983042f6dd5efa9994953cdb2d134d01f5df1d3b6ad15ab487525f371b5"',
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
