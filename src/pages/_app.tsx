import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, viewport-fit=cover' />
        <script
          defer
          data-domain='antitermo.hnqg.io'
          src='https://plausible.io/js/plausible.js'
        ></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
