import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useSystem } from "@app/hooks/useSystem";
import { useCtags } from "@app/hooks/useCtags";
import { useCurrentChain } from "@app/hooks/useCurrentChain";
import Layout from "@app/layouts/default";
import { timestampToString } from "@app/utils";
import { toEth } from "@app/utils";

import { AuctionProvider } from "@app/context/AuctionContext";
import WithinTagAuctionDisplay from "@app/components/auction/WithinTagAuctionDisplay";

import { TaggingRecords } from "@app/components/TaggingRecords";
import { TagGraphic } from "@app/components/TagGraphic";
import { Truncate } from "@app/components/Truncate";
import { CopyAndPaste } from "@app/components/CopyAndPaste";
import { Panel } from "@app/components/Panel";

/**
 * @description Queries the blockchain API for a specific transaction tag and renders
 * the relevant information from it, including the creator, owner, relayer, protocol,
 * revenue, and tagging records. It uses React's `useQuery` hook to handle fetching
 * data from the API.
 * 
 * @returns { JSXElement } a layout component that displays various information about
 * a particular Ethereum tag, including its owner, creator, relayer, and protocol,
 * as well as the revenue earned by each party.
 * 
 * 	1/ `Panel`: This is the component that wraps all other components in the return
 * output. It sets the layout and styling for the entire output.
 * 	2/ `title`: This property is a string that sets the title of the panel. It is set
 * to the value of `t("creator")` by default, which means "Creator" in the translation
 * file.
 * 	3/ `section`: This property is a string that sets the section name of the panel.
 * It is set to "Tagging" by default, but can be modified depending on the use case.
 * 	4/ `tags`: This property is an array of objects that contain information about
 * the creator, owner, and relayer of the tag. Each object in the array has properties
 * such as `id`, `name`, `display`, `relayer`, `owner`, and `creator`.
 * 	5/ `<div>` components: These are individual components that are wrapped by the
 * `Panel` component to create a container for all other output. They are used to
 * display information such as the creator's name, the owner's name, the relayer's
 * name, and the tag's name and ID.
 * 	6/ `<Link>` components: These are used to link to detailed pages for each creator,
 * owner, or relayer. They have a className of "link", which styles them as links.
 * 	7/ `Truncate` component: This is a custom component that is used to truncate long
 * text values and display only the first few characters. It is set up with a default
 * maximum length of 10 characters, but can be modified depending on the use case.
 * 	8/ `CopyAndPaste` component: This is a custom component that allows users to copy
 * and paste the value of the creator's ID. It has an MDG-Flow layout and styles
 * itself as a button.
 * 	9/ `<TaggingRecords>` component: This is a separate React component that displays
 * all tagging records for the selected tag. It has its own props and state, but is
 * imported into the main output function to be displayed within it.
 * 
 * 	Overall, the output returned by the `<anonymous>` function is a complex structure
 * that contains various components and properties, which work together to display
 * information about a specific tag and its associated creator, owner, relayer, and
 * protocol.
 */
const Tag: NextPage = () => {
  const { query } = useRouter();
  const { ownershipTermLength } = useSystem();
  const chain = useCurrentChain();
  const { tag } = query;
  const { t } = useTranslation("common");

  const { tags } = useCtags({
    pageSize: 1,
    skip: 0,
    filter: { machineName: tag },
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  });

  const taggingRecordsFilter = { tags_: { machineName: tag } };

  if (!tags || tags.length === 0) {
    return (
      <Layout>
        <div className="loading loading-spinner loading-md" />
      </Layout>
    );
  }

  let auctionBlock;
  if (tags[0].auctions && tags[0].auctions.length > 0) {
    const auction = tags[0].auctions[tags[0].auctions.length - 1];
    auctionBlock = (
      <AuctionProvider auctionId={Number(auction.id)}>
        <WithinTagAuctionDisplay />
      </AuctionProvider>
    );
  } else {
    auctionBlock = <div>NO AUCTION FOUND</div>;
  }

  return (
    <Layout>
      <section className="col-span-12 xl:col-span-4 flex flex-col gap-y-12  text-sm">
        <TagGraphic tag={tags[0]} />
        <Panel title={t("auction")}>
          <div className="p-6">{auctionBlock}</div>
        </Panel>
      </section>
      <section className="col-span-12 xl:col-span-8 flex flex-col gap-y-12 text-sm">
        <Panel title={t("overview")}>
          <div className="grid grid-flow-col grid-cols-2 px-6 py-4 space-x-4 hover:bg-slate-100">
            <div className="font-semibold">{t("id")}</div>
            <div className="flex space-x-1">
              <div className="grid flex-grow md:grid-flow-col justify-end">
                <div className=" ">{tags && Truncate(tags[0].id)}</div>
              </div>
              <CopyAndPaste value={tags && tags[0].id} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
            <div className="font-semibold">{t("created")}</div>
            <div className="text-right">
              <div className="">{tags && timestampToString(tags[0].timestamp)}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
            <div className="font-semibold">{t("expires")}</div>
            <div className="text-right">
              <div className="">{tags && timestampToString(+tags[0].timestamp + ownershipTermLength)}</div>
            </div>
          </div>

          <div className="grid grid-flow-col grid-cols-2 px-6 py-4 space-x-4 hover:bg-slate-100">
            <div className="font-semibold">{t("relayer")}</div>
            <div className="flex col-span-3 space-x-1">
              <div className="grid flex-grow grid-cols-1 md:grid-flow-col ">
                <div className="overflow-hidden text-right text-ellipsis whitespace-nowrap">
                  <Link href={`/relayers/${tags && tags[0].relayer.id}`} className="link link-primary">
                    {tags && tags[0].relayer.name}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-flow-col grid-cols-2 px-6 py-4 space-x-4 hover:bg-slate-100">
            <div className="font-semibold">{t("creator")}</div>
            <div className="flex space-x-1 justify-end">
              <div className="">
                <Link href={`/creators/${tags && tags[0].creator.id}`} className="link link-primary">
                  {tags && Truncate(tags[0].creator.id)}
                </Link>
              </div>
              <CopyAndPaste value={tags && tags[0].creator.id} />
            </div>
          </div>

          <div className="grid grid-flow-col grid-cols-2 px-6 py-4 space-x-4 hover:bg-slate-100">
            <div className="font-semibold">{t("owner")}</div>
            <div className="flex space-x-1 justify-end">
              <div className="">
                <Link href={`/owners/${tags && tags[0].owner.id}`} className="link link-primary">
                  {tags && Truncate(tags[0].owner.id)}
                </Link>
              </div>
              <CopyAndPaste value={tags && tags[0].owner.id} />
            </div>
          </div>
        </Panel>
        <Panel title={t("revenue")}>
          <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
            <div className="font-semibold">{t("tagging-records")}</div>
            <div className="text-right">
              <div className="">{tags && tags[0].tagAppliedInTaggingRecord}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
            <div className="font-semibold">{t("creator")}</div>
            <div className="text-right">
              <div className="">
                {tags && toEth(tags[0].creatorRevenue, 8)} {chain?.nativeCurrency.symbol}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
            <div className="font-semibold">{t("owner")}</div>
            <div className="text-right">
              <div className="">
                {tags && toEth(tags[0].ownerRevenue, 8)} {chain?.nativeCurrency.symbol}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
            <div className="font-semibold">{t("relayer")}</div>
            <div className="text-right">
              <div className="">
                {tags && toEth(tags[0].relayerRevenue, 8)} {chain?.nativeCurrency.symbol}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
            <div className="font-semibold">{t("protocol")}</div>
            <div className="text-right">
              <div className="">
                {tags && toEth(tags[0].protocolRevenue, 8)} {chain?.nativeCurrency.symbol}
              </div>
            </div>
          </div>
        </Panel>
      </section>
      <div className="col-span-12">
        <TaggingRecords
          filter={taggingRecordsFilter}
          title={t("tag-tagging-records", {
            tag: tags && tags[0].display,
          })}
        />
      </div>
    </Layout>
  );
};

export default Tag;
