import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ethereum Tag Service</title>
      </Head>

      <div className="flex items-center justify-center h-screen">
        <svg className="w-32 h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path className="text-slate-900" fill="currentColor" d="M0 50 50 0H0v50zm100 50V50l-50 50h50zM50 0l50 50V0H50zM19.9 84.9c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.3 5 5z"/>
        </svg>
      </div>
    </>
  );
}

export default Home;
