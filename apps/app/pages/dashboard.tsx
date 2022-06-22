import type { NextPage } from 'next';
import { RecentlyTagged } from '../components/RecentlyTagged';
import { NewestTags } from '../components/NewestTags';
import { TopCreators } from '../components/TopCreators';
import { TopPublishers } from '../components/TopPublishers';
import { TopTaggers } from '../components/TopTaggers';
import { PopularTags } from '../components/PopularTags';
import { Stats } from '../components/Stats';

const Home: NextPage = () => {
  return (
    <div className="grid max-w-6xl gap-6 mx-auto mt-12 lg:gap-12 md:space-y-0 sm:w-full">
      <Stats />
      <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
        <RecentlyTagged />
        <NewestTags />
        <TopCreators />
        <TopPublishers />
        <TopTaggers />
        <PopularTags />
      </div>
    </div>
  );
}

export default Home;
