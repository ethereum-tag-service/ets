import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ethereum Tag Service</title>
        <meta name="description" content="Ethereum Tag Service is the community-owned incentivized cross-chain content tagging protocol for the decentralized web." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <div className="flex flex-col items-center justify-center h-screen text-center">
        <svg className="h-20 text-slate-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 294 100">
          <path fill="currentColor" d="M129.1 16.2h45.7v10.3h-34v17.3h33.3v10.3h-33.3v18.5h34v10.3h-45.7V16.2zm73.6 10.3h-20.2V16.2h52.1v10.3h-20.2v56.4h-11.7V26.5zm43.5 38c4.6 4.9 11.8 9.2 21.1 9.2 9.6 0 13.4-4.7 13.4-9.1 0-6-7.1-7.8-15.2-9.9-10.9-2.7-23.7-5.9-23.7-20 0-11 9.7-19.5 24.3-19.5 10.4 0 18.8 3.3 25 9.3l-6.7 8.7c-5.2-5.2-12.3-7.6-19.3-7.6-6.9 0-11.3 3.3-11.3 8.3 0 5.2 6.8 6.9 14.7 8.9 11 2.8 24.1 6.2 24.1 20.7 0 11.1-7.8 20.6-25.8 20.6-12.3 0-21.2-4.3-27.1-10.6l6.5-9zM0 49.7l50-50H0v50zm100 50v-50l-50 50h50zM50-.3l50 50v-50H50z" />
          <circle fill="currentColor" cx="14.9" cy="84.7" r="5" />
        </svg>
        <p className="mt-8">email <a className="text-pink-600 hover:text-pink-700" href='ma&#105;&#108;t&#111;&#58;%&#54;&#67;a%&#55;5&#110;%63h&#64;%&#54;5%7&#52;&#115;&#46;%78yz?subject=notify'>&#108;aun&#99;h&#64;ets&#46;x&#121;z</a> to get <br />notified when we launch</p>
      </div>
    </>
  );
}

export default Home;
