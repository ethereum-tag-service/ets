import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import useTranslation from 'next-translate/useTranslation';

const PopularTags = () => {
  const { t } = useTranslation('common');
  const { data, error } = useSWR(
    `{
      popular: hashtags(first: 5, orderBy: tagCount, orderDirection: desc) {
        id
        name
        displayHashtag
        owner
        publisher
        tagCount
      }
    }`);

  return (
    <div className="w-full mx-auto">
      <Link href="/">
        <a className="flex justify-between border border-b-0 border-slate-900">
          <div>
            <h2 className="px-6 py-3 text-xs tracking-wider text-left text-black uppercase">{t('popular-tags')}</h2>
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
        {data && data.popular.map((tag: any) => (
          <div className="flex justify-between px-6 py-4 space-x-4" key={tag.id}>
            <div className="overflow-hidden text-pink-600 text-ellipsis whitespace-nowrap">
              <Link href="/">
                <a className="text-pink-600">{tag.name}</a>
              </Link>
            </div>
            <div className="text-sm leading-6 whitespace-nowrap text-slate-500">{t('tagged-count', { count: parseInt(tag.tagCount) })}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { PopularTags };
