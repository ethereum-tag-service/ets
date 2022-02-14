import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import TimeAgo from 'react-timeago';
import useTranslation from 'next-translate/useTranslation';
import useTimeAgo from '../hooks/useTimeAgo';

const RecentlyTagged = () => {
  const { t, lang } = useTranslation('common');
  const formatter = useTimeAgo(lang);
  const { data, error } = useSWR(
    `{
      tags(first: 5, orderBy: timestamp, orderDirection: desc) {
        id
        hashtagId
        hashtagDisplayHashtag
        nftContract
        nftContractName
        nftImage
        nftName
        nftDescription
        nftId
        tagger
        timestamp
        publisher
        nftChainId
      }
    }`);

  const chainName: { [key: number]: string } = {
    1: 'Ethereum',
    80001: 'Polygon Mumbai',
  }

  return (
    <div className="w-full mx-auto">
      <Link href="/">
        <a className="flex justify-between border border-b-0 border-slate-900">
          <div>
            <h2 className="px-6 py-3 text-xs tracking-wider text-left text-black uppercase">{t('recently-tagged')}</h2>
          </div>
          <div className="flex items-center pr-2">
            <svg className="inline-flex w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 15.25V6.75H8.75"></path>
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 7L6.75 17.25"></path>
            </svg>
          </div>
        </a>
      </Link>

      <div className="border divide-y border-slate-900 divide-slate-200">
        {/* TODO: update :any to use type */}
        {data && data.tags.map((tag: any) => (
          <div className="flex px-6 py-4 space-x-4" key={tag.id}>
            <div>
              <div className="w-12 h-12 bg-slate-100"></div>
            </div>
            <div className="grid flex-grow grid-cols-2 space-x-4 md:grid-flow-col">
              <div>
                <div className="overflow-hidden text-pink-600 text-ellipsis whitespace-nowrap">
                  <Link href="/">
                    <a className="text-pink-600">{tag.nftId}</a>
                  </Link>
                </div>
                <div className="text-sm leading-6 text-slate-500"><TimeAgo date={tag.timestamp * 1000} formatter={formatter} /></div>
              </div>
              <div>
                <div className="overflow-hidden text-pink-600 text-ellipsis whitespace-nowrap">
                  <Link href="/">
                    <a className="text-pink-600">{tag.hashtagDisplayHashtag}</a>
                  </Link>
                </div>
                <div className="text-sm leading-6 text-slate-500">{chainName[tag.nftChainId]}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { RecentlyTagged };
