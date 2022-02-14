import type { NextPage } from 'next';
import { RecentlyTagged } from '../components/RecentlyTagged';
import { NewestTags } from '../components/NewestTags';
import { TopCreators } from '../components/TopCreators';
import { TopPublishers } from '../components/TopPublishers';
import { TopTaggers } from '../components/TopTaggers';
import { PopularTags } from '../components/PopularTags';
// import Image from 'next/image';

// import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json';
// use it like this:
// const contract = new ethers.Contract(process.env.NEXT_PUBLIC_GREETER_ADDRESS, Greeter.abi, provider)

// import { Button } from "@ets/ui"; // example of how to pull in UI

const Home: NextPage = () => {
  return (
    <div>
      <div className="max-w-6xl gap-12 mx-auto mt-12 space-y-8 md:space-y-0 md:grid sm:w-full md:grid-cols-2">
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
