import { GiphyFetch } from '@giphy/js-fetch-api';

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY || '');

export default gf;
