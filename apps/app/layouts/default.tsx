import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Layout({ children }: {children: ReactNode}) {
  return (
    <>
      <Head>
        <title>Ethereum Tag Service</title>
        <meta name="description" content="Ethereum Tag Service is the community-owned incentivized cross-chain content tagging protocol for the decentralized web." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Navbar />
      <main className="flex-grow px-4">
        {children}
      </main>
      <Footer />
    </>
  )
}
