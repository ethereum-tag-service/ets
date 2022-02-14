import type { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';

const Error404: NextPage = () => {
  const { t } = useTranslation('error');
  return (
    <div className="flex items-center justify-center h-full max-w-6xl py-12 mx-auto">
      <span className="text-xl text-slate-500">{t('404')}</span>
    </div>
  );
}

export default Error404;
