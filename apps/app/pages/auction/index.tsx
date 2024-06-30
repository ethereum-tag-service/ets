import { useState, useMemo } from "react";
import type { NextPage } from "next";
import { TagType } from "@app/types/tag";
import Layout from "@app/layouts/default";
import useTranslation from "next-translate/useTranslation";
import { useSystem } from "@app/hooks/useSystem";
import { AuctionProvider } from "@app/context/AuctionContext";
import { useAuctionHouse } from "@app/hooks/useAuctionHouse";
import { useCtags } from "@app/hooks/useCtags";
import { toEth } from "@app/utils";
import { Truncate } from "@app/components/Truncate";
import { TimeAgo } from "@app/components/TimeAgo";
import { Tag } from "@app/components/Tag";
import AuctionActions from "@app/components/auction/AuctionActions";
import AuctionTimer from "@app/components/auction/AuctionTimer";
import { createColumnHelper } from "@tanstack/react-table";
import { TanstackTable } from "@app/components/TanstackTable";
import Link from "next/link";

/**
 * @description Generates an HOC that displays Tanstack auction data based on the
 * user's role, showing upcoming, active, and settled auctions with different column
 * headers for each state. It uses `useMemo` to memoize the columns for each state.
 * 
 * @returns { JSXElement } a layout that displays auctions, upcoming tags, and settled
 * tags.
 * 
 * 	1/ `activeAuctions`: An array of auction objects containing information about
 * each upcoming auction. The object properties include:
 * 		* `auctionId`: A unique identifier for each auction (number)
 * 		* `display`: A string representing the tag for each auction (e.g., "Tag 1")
 * 		* `timestamp`: The creation date and time of each auction in ISO 8601 format (string)
 * 		* `ownerId`: The ID of the owner of each auction (number)
 * 		* `relayerId`: The ID of the relayer of each auction (number)
 * 		* `tagAppliedInTaggingRecord`: The number of tagging records applied to each
 * auction (integer)
 * 	2/ `upcomingTags`: An array of tag objects containing information about each
 * upcoming tag. The object properties include:
 * 		* `id`: A unique identifier for each tag (number)
 * 		* `display`: A string representing the tag (e.g., "Tag 1")
 * 		* `timestamp`: The creation date and time of each tag in ISO 8601 format (string)
 * 	3/ `settledAuctions`: An array of auction objects containing information about
 * each settled auction. The object properties include:
 * 		* `id`: A unique identifier for each auction (number)
 * 		* `auctionId`: A unique identifier for each auction (number)
 * 		* `display`: A string representing the tag for each auction (e.g., "Tag 1")
 * 		* `timestamp`: The creation date and time of each auction in ISO 8601 format (string)
 * 		* `bidderId`: The ID of the bidder who won each auction (number)
 * 		* `endTime`: The end time of each auction in ISO 8601 format (string)
 * 	4/ `loading`: A boolean indicating whether there are any active, upcoming, or
 * settled auctions (default: `true`)
 * 	5/ `rowLink`: A function that links to the auction details page for each auction
 * row (funcion takes a single argument: auction)
 * 	6/ `t`: An object containing translations for each auction column header (obj
 * contains keys as column headers and values as their translations in English).
 * 	7/ `<TanstackTable>`: A React table component that renders the output of the
 * functions passed to its props (properties) object.
 * 	8/ `data`: An array of objects containing information about each auction, upcoming
 * tag, or settled auction. Each object property includes the columns returned by the
 * TanstackTable component.
 */
const Auction: NextPage = () => {
  const { t } = useTranslation("common");
  const { platformAddress } = useSystem();
  const { allAuctions } = useAuctionHouse();

  const [pageIndex, setPageIndex] = useState(0);
  const { tags = [], nextTags } = useCtags({
    skip: pageIndex * 20,
    orderBy: "tagAppliedInTaggingRecord",
    filter: { owner_: { id: platformAddress.toLowerCase() } },
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 1500,
    },
  });

  // Function to print debugging information
  /**
   * @description Iterates through an array of tags and logs details about each tag,
   * including its ID and auction status (settled or active).
   * 
   * @param { TagType[] } tags - array of tags for which the active and settled statuses
   * are to be determined, and its contents are iterated over to log the tag ID and
   * auction information.
   */
  const printDebugInfo = (tags: TagType[]) => {
    tags.forEach((tag) => {
      console.log(`Tag ID: ${tag.display}`);
      if (tag.auctions) {
        tag.auctions.forEach((auction) => {
          console.log(`  Auction ID: ${auction.display}, Status: ${auction.settled ? "Settled" : "Active"}`);
        });
      } else {
        console.log("  No auctions available for this tag.");
      }
    });
  };

  // Function to filter out tags with active auctions
  /**
   * @description Removes any tags that do not have active auctions or have an empty
   * array of auctions, or all the auctions are settled.
   * 
   * @param { TagType[] } tags - array of TagTypes that the function filters to return
   * only those with zero or no settled auctions.
   * 
   * @returns { TagType[] } an array of tags that are eligible for a sale or auction.
   */
  const filterEligibleTags = (tags: TagType[]): TagType[] => {
    //printDebugInfo(tags);
    return tags.filter(
      (tag) => !tag.auctions || tag.auctions.length === 0 || tag.auctions.every((auction) => auction.settled),
    );
  };

  // Perform secondary sorting by timestamp on the client side and filter eligible tags
  const upcomingTags = filterEligibleTags(tags as TagType[]).sort((a, b) => {
    const tagAppliedA = a.tagAppliedInTaggingRecord ?? -Infinity;
    const tagAppliedB = b.tagAppliedInTaggingRecord ?? -Infinity;

    if (tagAppliedA === tagAppliedB) {
      return a.timestamp - b.timestamp; // Unix timestamp comparison (ascending order)
    }
    return tagAppliedB - tagAppliedA;
  });

  const settledAuctions = allAuctions.filter((auction) => auction.settled);
  const activeAuctions = allAuctions
    .filter((auction) => auction.startTime === 0 || auction.settled === false)
    .sort((a, b) => b.id - a.id);

  const columnHelper = createColumnHelper();
  const activeColumns = useMemo(
    () => [
      columnHelper.accessor("tag", {
        header: t("tag"),
        cell: (info) => <Tag tag={info.getValue()} />,
      }),
      columnHelper.accessor("amount", {
        header: t("current bid"),
        /**
         * @description Takes a `info` argument and returns an auction start time in ETH,
         * where the value is obtained from the input row and rounded to the nearest fifth
         * of an ETH unit. If the start time is 0, the return value is a hyphen (-).
         * 
         * @param { `row`. } info - row of data containing information about an auction, which
         * is used to calculate the start time and value of the auction.
         * 
         * 	* `row`: The row number of the auction in the dataset.
         * 	* `original`: The original value of the auction, which is an object representing
         * the auction details.
         * 	* `getValue()`: A function that calculates the current value of the auction in
         * ETH, based on the auction details and the current timestamp. The function takes
         * no arguments and returns the calculated value in ETH.
         * 
         * 	The `cell` function then checks if the start time of the auction is 0, and if so,
         * returns a dash (-). Otherwise, it returns the calculated value of the auction in
         * ETH.
         * 
         * @returns { string } the amount of ETH, displayed in the format of `--` if the start
         * time is 0, or the amount converted to ETH in the format of X ETH where X is the
         * value and 5 is the precision.
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return auction.startTime === 0 ? "—" : `${toEth(info.getValue(), 5)} ETH`;
        },
      }),
      columnHelper.accessor("bidder.id", {
        header: t("bidder"),
        /**
         * @description Truncates a value at most 13 characters and adds a hyphen if the input
         * time is zero.
         * 
         * @param { object } info - row object containing the value to be formatted, which
         * is then returned after applying the formatting rules.
         * 
         * @returns { string } a truncated string representation of the `startTime` value for
         * each auction, with a maximum length of 13 characters.
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return auction.startTime === 0 ? "—" : Truncate(info.getValue(), 13, "middle");
        },
      }),
      columnHelper.accessor("endTime", {
        header: t("time left"),
        /**
         * @description Creates an instance of the `AuctionTimer` component for the given
         * auction object.
         * 
         * @param { object } info - row object containing details of an auction, which is
         * then used to create an instance of the `AuctionTimer` component.
         * 
         * @returns { Component } an HTML element representing an Auction Timer component.
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return <AuctionTimer auction={auction} />;
        },
      }),
      columnHelper.accessor("id", {
        header: "",
        /**
         * @description Takes an `info` object containing a row item, and returns an HTML
         * element representing the auction actions for that item.
         * 
         * @param { `Row`. } info - Row data from the dataset and is used to fetch the
         * AuctionActions component with the appropriate auction details.
         * 
         * 	* `const auction = info.row.original as any;`: This line of code extracts the
         * `auction` property from the `info` object and assigns it a value using the `as
         * any;` syntax. This is done to ensure that the type of the `auction` property is
         * assignable to the `Auction` interface.
         * 	* `return (`: This line of code marks the beginning of a return statement.
         * 	* `<AuctionProvider key={auction.id} auctionId={auction.id}>`: This line of code
         * uses the `AuctionProvider` component to wrap the child components with the appropriate
         * AuctionContext provider. The `key` prop is set to the `auction.id` property, and
         * the `auctionId` prop is set to the same value.
         * 	* `<AuctionActions key={info.getValue()} auction={auction} buttonClasses="btn-primary
         * btn-outline btn-sm">`: This line of code uses the `AuctionActions` component to
         * render actions for the Auction. The `key` prop is set to the `info.getValue()`
         * property, and the `auction` prop is set to the same value as the `auction` property
         * in the previous line. The `buttonClasses` prop is set to a CSS class string
         * indicating the desired button styles (e.g. "btn-primary", "btn-outline", etc.).
         * 
         * 	In summary, the `cell` function takes an input `info` object containing a `row`
         * property that contains an `original` property with the actual Auction data, and
         * returns a component tree consisting of an `AuctionProvider` wrapping an `AuctionActions`
         * component.
         * 
         * @returns { HTML element, specifically `<AuctionProvider> ... </AuctionProvider }
         * an AuctionProvider component that renders an AuctionActions component with custom
         * button classes.
         * 
         * 	* `<AuctionProvider>`: This component is a higher-order component (HOC) that wraps
         * around the `AuctionActions` component and provides an auction ID to its children.
         * 	* `auctionId`: This prop is set to the value of the `id` property of the `auction`
         * object passed as a prop to the `AuctionProvider` component.
         * 	* `<AuctionActions>`: This component is responsible for rendering buttons for
         * managing the auction.
         * 	* `buttonClasses`: This prop is a class string that specifies the styles for the
         * buttons rendered by the `<AuctionActions>` component. The value of this prop is
         * `"btn-primary btn-outline btn-sm"`.
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return (
            <AuctionProvider key={auction.id} auctionId={auction.id}>
              <AuctionActions key={info.getValue()} auction={auction} buttonClasses="btn-primary btn-outline btn-sm" />
            </AuctionProvider>
          );
        },
      }),
    ],
    [t],
  );

  const upcomingColumns = useMemo(
    () => [
      columnHelper.accessor("display", {
        header: () => t("tag"),
        cell: (info) => <Tag tag={info.row.original as TagType} />,
      }),
      columnHelper.accessor("timestamp", {
        header: t("created"),
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
      columnHelper.accessor("owner.id", {
        header: t("owner"),
        cell: (info) => Truncate(info.getValue(), 13, "middle"),
      }),
      columnHelper.accessor("relayer.id", {
        header: t("relayer"),
        cell: (info) => Truncate(info.getValue(), 13, "middle"),
      }),
      columnHelper.accessor("tagAppliedInTaggingRecord", {
        header: t("tagging records"),
      }),
    ],
    [t],
  );

  const settledColumns = useMemo(
    () => [
      /*       columnHelper.accessor("id", {
        header: "#",
        cell: (info) => {
          return (
            <Link href={`/auction/${info.getValue()}`} className="link link-primary">
              {info.getValue()}
            </Link>
          );
        },
      }), */
      columnHelper.accessor("tag", {
        header: t("tag"),
        cell: (info) => <Tag tag={info.getValue()} />,
      }),
      columnHelper.accessor("amount", {
        header: t("price"),
        cell: (info) => `${toEth(info.getValue(), 4)}`,
      }),
      columnHelper.accessor("bidder.id", {
        header: t("winner"),
        cell: (info) => Truncate(info.getValue(), 13, "middle"),
      }),
      columnHelper.accessor("endTime", {
        header: t("ended"),
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
    ],
    [t],
  );

  return (
    <Layout>
      {/*
      <div className="dropdown dropdown-hover dropdown-end">
        <div tabIndex={0} role="button" className="text-info">
          <svg
            tabIndex={0}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-4 w-4 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <p className="font-semibold">Upcoming Auctions</p>
          <p>Tags with the most tagging records are released next.</p>
        </div>
      </div>
      */}
      <div role="tablist" className="tabs tabs-lg col-span-12 auctions">
        <input type="radio" name="auctions" role="tab" className="tab" aria-label={t("active")} defaultChecked />
        <div role="tabpanel" className="tab-content">
          {/**
           * @description Displays an auction list based on given data and column settings,
           * with a link to view more information about each auction.
           * 
           * @param { array } columns - array of column definitions that are displayed in the
           * table.
           * 
           * @param { object } data - array of active auctions to display in the Tanstack table.
           * 
           * @param { boolean } loading - whether the auctions array is empty or not.
           * 
           * @param { anchor tag URL link. } rowLink - RowLink component that, when clicked,
           * navigates to the tag detail page for the auction associated with the current row.
           * 
           * 	* `loading`: A boolean indicating whether there are no auctions available or not.
           * When `loading` is `true`, the table has no data and may display a loading indicator.
           * 	* `column`: An array of objects containing the properties and attributes of each
           * column in the table. Each object in the array corresponds to a column and defines
           * its title, type, and other attributes.
           * 	* `data`: An array of objects representing the auctions that will be displayed
           * in the table. Each object in the array contains the details of an individual
           * auction, including its tag name, machine name, and other relevant information.
           */}
          <TanstackTable
            columns={activeColumns}
            data={activeAuctions}
            loading={!activeAuctions.length}
            rowLink={(auction) => `/tags/${auction.tag.machineName}`}
          />
        </div>

        <input type="radio" name="auctions" role="tab" className="tab" aria-label={t("upcoming")} />
        <div role="tabpanel" className="tab-content">
          {/**
           * @description Displays upcoming tags.
           * 
           * @param { array } columns - 3 tags that are going to be displayed on the tag page.
           * 
           * @param { array } data - Tags object that contains information about upcoming tags,
           * including their names and other relevant details.
           * 
           * @param { boolean } loading - whether there are any tags available for display or
           * not, and it is passed to the `TanstackTable` component as an argument to control
           * the loading state of the data.
           * 
           * @param { link reference type. } rowLink - URL of the tag machine detail page when
           * clicking on a row in the table.
           * 
           * 	* `loading`: A boolean indicating whether there are no tags available for display.
           * (Passed in as `!upcomingTags.length`.)
           * 	* `(tag) => `/tags/${tag.machineName}`: A function that generates a link to the
           * corresponding tag page when called with a tag object.
           */}
          <TanstackTable
            columns={upcomingColumns}
            data={upcomingTags}
            loading={!upcomingTags.length}
            rowLink={(tag) => `/tags/${tag.machineName}`}
          />
        </div>

        <input type="radio" name="auctions" role="tab" className="tab" aria-label={t("settled")} />
        <div role="tabpanel" className="tab-content">
          {/**
           * @description Displays an array of auctions data to the user
           * 
           * @param { array } columns - 0 or more fields of a table column configuration to
           * display within the given auction table component.
           * 
           * @param { array } data - settled auctions that are displayed on the table.
           * 
           * @param { boolean } loading - existence or non-existence of auctions, and it affects
           * the display of the auction list in the component.
           * 
           * @param { string } rowLink - URL of the auction details page for each settled auction
           * in the `settledAuctions` data set.
           */}
          <TanstackTable
            columns={settledColumns}
            data={settledAuctions}
            loading={!settledAuctions.length}
            rowLink={(auction) => `/tags/${auction.tag.machineName}`}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Auction;
