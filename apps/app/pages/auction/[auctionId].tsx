import type { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "@app/layouts/default";

import { AuctionProvider } from "@app/context/AuctionContext";
import AuctionDisplay from "@app/components/auction/AuctionDisplay";

interface AuctionPageProps {
  initialAuctionId?: number;
}

/**
 * @description Uses the `useRouter` hook to access the router's query object, and
 * then retrieves the value of the `auctionId` property from that object. It then
 * passes this value to the `AuctionProvider` component as a prop.
 * 
 * @returns { HTML element } an HTML layout containing an AuctionDisplay component,
 * passed an auction ID retrieved from the URL query parameters.
 * 
 * 	* `Layout`: A React component that is the parent component of the returned output.
 * 	* `AuctionProvider`: A React component that provides an auction ID to the child
 * component (the `AuctionDisplay` component). The `auctionId` property is passed as
 * a prop from the parent component to the child component.
 */
const AuctionPage: NextPage<AuctionPageProps> = () => {
  const router = useRouter();
  const { auctionId } = router.query;

  return (
    <Layout>
      <AuctionProvider auctionId={Number(auctionId)}>
        <AuctionDisplay />
      </AuctionProvider>
    </Layout>
  );
};

export default AuctionPage;
