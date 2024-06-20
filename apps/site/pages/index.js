import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

/**
 * @description Generates HTML content that introduces Ethereum Tag Service, including
 * an SVG icon, heading, and subheadings. It also provides a brief explanation of
 * ETS's unique approach to tagging.
 * 
 * @returns { HTML element of type `div } a React component that displays information
 * about the Ethereum Tag Service.
 * 
 * 	* The `<div>` element with the className "flex items-center justify-center h-screen
 * px-6" creates a container for the rest of the content on the page.
 * 	* The `<Head>` element is used to set metadata for the webpage, including the
 * title, meta name="description", and favicon link.
 * 	* The `<main>` element contains the majority of the content on the page, including
 * a header with a h1 tag, a paragraph of text explaining Ethereum Tag Service, and
 * three buttons with links to different resources.
 * 	* The `Head` and `main` elements are both contained within the same `<div>`
 * element, indicating that they are part of the main content area of the page.
 * 	* The CSS classes used in the markup (e.g. "flex", "items-center", "justify-center",
 * "h-screen", "px-6") provide layout and styling for the page elements.
 * 
 * 	In terms of the output, it is a React component function that returns an HTML
 * structure composed of various elements, including headers, paragraphs, buttons,
 * and links. The returned output has a container div with a set of CSS classes applied
 * to it, which define its layout and styling.
 */
export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen px-6">
      <Head>
        <title>Ethereum Tag Service</title>
        <meta name="description" content="An experimental EVM based content tagging service" />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className="max-w-sm py-6 my-auto space-y-6">
        <div className="flex items-center justify-center mt-10 mb-14">
          <svg
            className="w-8 h-8 text-slate-800"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
          >
            <path
              fill="currentColor"
              d="M0 50 50 0H0v50zm100 50V50l-50 50h50zM50 0l50 50V0H50zM19.9 84.9c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.3 5 5z"
            />
          </svg>
          <span className="inline-flex ml-2.5 text-xl font-medium text-slate-900">
            Ethereum Tag Service
          </span>
        </div>
        <h1 className="sr-only">Ethereum Tag Service</h1>

        <p className="font-medium">ETS is a permissionless protocol for writing immutable tagging records to an EVM blockchain.</p>

        <p>In simpler terms, an ETS tagging record is a record of &ldquo;who tagged what, with what, where, when &amp; why.&rdquo;</p>

        <p>Technically, a tagging record is similar to a DNS record, but unlike DNS, ETS allows a name or &ldquo;tag&rdquo; to be used across multiple records. This is possible in part because tags are Non-Fungible Tokens (NFTs), which means that each tag has a unique identification number.</p>

        <p>When a user writes a new tagging record that includes existing tags, the system will reference their unique token IDs. If a new tag is used, the system will create a new token for that tag.</p>

        <p>There are no restrictions on the use of tokenized tags, and any client can use any tag at any time. Tokenization is used to track origin attribution and rewards given to participants.</p>

        <p>This approach to tagging is unique to ETS and allows for new treatments of tags, including origin attribution, tag ownership, platform-agnostic tag reuse, and tagging cash flows such as sponsorships and rewards.</p>

        <p>All tagging records create a public tag graph that can be queried by any client in any dimension defined by the core ETS tagging record schema.</p>

        <div className="flex justify-center space-x-4 pt-5 pb-20">
          <a href="https://youtu.be/M7s5fth13uA" target="_blank" rel="noreferrer">
            <button className="bg-transparent text-sm hover:bg-pink-500 text-pink-700 hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded">
              Quick Intro
            </button>
          </a>
          <a href="https://app.ets.xyz" target="_blank" rel="noreferrer">
            <button className="bg-transparent text-sm hover:bg-pink-500 text-pink-700 hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded">
              Explorer
            </button>
          </a>
          <a href="https://github.com/ethereum-tag-service/ets#readme" target="_blank" rel="noreferrer">
            <button className="bg-transparent text-sm hover:bg-pink-500 text-pink-700 hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded">
              Github
            </button>
          </a>
          <a href="https://blog.ets.xyz" target='_blank' rel="noreferrer">
            <button className="bg-transparent text-sm hover:bg-pink-500 text-pink-700 hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded">
              Blog
            </button>
          </a>
        </div>
      </main>
    </div>
  )
}
