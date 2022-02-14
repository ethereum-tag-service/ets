import React, { FC } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

const Navbar: FC = () => {
  const { t } = useTranslation('common');
  return (
    <div className="mx-4">
      <div className="flex items-center justify-between max-w-6xl pt-4 mx-auto mb-4 space-x-4">
        <Link href="/">
          <a className="text-pink-600">
            <svg fill="currentColor" className="text-slate-900 h-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M0 50 50 0H0v50zm100 50V50l-50 50h50zM50 0l50 50V0H50zM18.6 88.6c-5.4 4.1-11.4-2-7.3-7.3 5.3-4.1 11.4 2 7.3 7.3z"/>
            </svg>
            <h1 className="sr-only">Ethereum Tag Service</h1>
          </a>
        </Link>

        <div>
          <button className="flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-colors bg-pink-500 border border-transparent rounded-lg shadow-lg shadow-pink-500/30 hover:bg-pink-600">
            {t('connect-wallet')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
