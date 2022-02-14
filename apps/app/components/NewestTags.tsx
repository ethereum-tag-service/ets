import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import TimeAgo from 'react-timeago';
import useTranslation from 'next-translate/useTranslation';
import useTimeAgo from '../hooks/useTimeAgo';

const NewestTags  = () => {
  const { t, lang } = useTranslation('common');
  const formatter = useTimeAgo(lang);
  const { data, error } = useSWR(
    `{
      hashtags(first: 5, orderBy: timestamp, orderDirection: desc) {
        id
        name
        displayHashtag
        owner
        creator
        publisher
        timestamp
        tagCount
      }
    }`);

  return (
    <div className="w-full mx-auto">
      <Link href="/">
        <a className="flex justify-between border border-b-0 border-slate-900">
          <div>
            <h2 className="px-6 py-3 text-xs tracking-wider text-left text-black uppercase">{t('newest-tags')}</h2>
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
        {data && data.hashtags.map((hashtag: any) => (
          <div className="px-6 py-4 md:grid-flow-col md:space-x-4 md:grid md:grid-cols-2" key={hashtag.id}>
            <div className="grid grid-cols-2 space-x-4 md:block md:space-x-0">
              <div className="overflow-hidden text-pink-600 text-ellipsis whitespace-nowrap">
                <Link href="/">
                  <a className="text-pink-600">{hashtag.name}</a>
                </Link>
              </div>
              <div className="text-sm leading-6 text-slate-500"><TimeAgo date={hashtag.timestamp * 1000} formatter={formatter} /></div>
            </div>
            <div className="grid grid-cols-2 space-x-4 md:block md:space-x-0">
              <div className="overflow-hidden text-pink-600 text-ellipsis whitespace-nowrap">
                <span className="mr-1 text-sm text-slate-700">{t('creator')}</span>
                <span className="text-base">
                  <Link href="/">
                    <a className="text-pink-600">{hashtag.creator}</a>
                  </Link>
                </span>
              </div>
              <div className="overflow-hidden text-pink-600 text-ellipsis whitespace-nowrap">
                <span className="mr-1 text-sm text-slate-700">{t('publisher')}</span>
                <span className="text-base">
                  <Link href="/">
                    <a className="text-pink-600">{hashtag.publisher}</a>
                  </Link>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { NewestTags };
