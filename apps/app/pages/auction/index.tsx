import type { NextPage } from "next";
import Layout from "@app/layouts/default";
import useTranslation from "next-translate/useTranslation";
import { useAuctionHouse } from "@app/hooks/useAuctionHouse";
import { useCtags } from "@app/hooks/useCtags";
import { toEth } from "@app/utils";
import { Truncate } from "@app/components/Truncate";
import { TimeAgo } from "@app/components/TimeAgo";
import { Tag } from "@app/components/Tag";
import { Tags } from "@app/components/Tags";
import AuctionActions from "@app/components/auction/AuctionActions";
import AuctionTimer from "@app/components/auction/AuctionTimer";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { TanstackTable } from "@app/components/TanstackTable";
import Link from "next/link";
import { globalSettings } from "@app/config/globalSettings";

/**
 * @description Generates high-quality documentation for given code by creating and
 * returned a layout with two TanstackTable components, one for active auctions and
 * one for settled auctions, and a third component for displaying upcoming auctions
 * tags.
 * 
 * @returns { HTML element } a Tanstack table displaying active and settled auctions,
 * along with their corresponding details.
 * 
 * 	1/ `activeColumns`: An array of column objects that represent the active auctions.
 * Each column object contains information about the auction ID, tag, current bid (in
 * ETH), bidder ID, end time, and an action button.
 * 	2/ `settledColumns`: An array of column objects that represent the settled auctions.
 * Similar to `activeColumns`, each column object contains information about the
 * auction ID, tag, price, winner ID, ended date, and an action button.
 * 	3/ `allAuctions`: An array of auction objects representing all auctions available.
 * Each auction object contains information about the auction ID, start time, end
 * time (or whether it's settled), bid amount (or 0 if it's not started yet), and
 * winner ID.
 * 	4/ `activeAuctions`: An array of auction objects representing the active auctions.
 * This array is filtered from `allAuctions` to only include auctions that have a
 * start time of 0 or are unsettled.
 * 	5/ `settledAuctions`: An array of auction objects representing the settled auctions.
 * This array is also filtered from `allAuctions`, but with a different filter condition
 * (auctions with a settle status of true).
 * 	6/ `<TanstackTable>`: A component that renders a table with the provided columns
 * and data. It takes various props such as `columns`, `data`, `loading`, `title`,
 * and `rowLink` to customize its behavior.
 * 	7/ `<Tags>`: A component that renders a list of tags. It takes various props such
 * as `tags`, `title`, `rowLink`, and `columnsConfig` to customize its behavior.
 * 	8/ `Truncate`: A function used to truncate long strings to a specified length,
 * in this case, 13 characters.
 */
const Auction: NextPage = () => {
  const { t } = useTranslation("common");

  const { tags = [] } = useCtags({
    orderBy: "tagAppliedInTaggingRecord",
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 1500,
    },
  });

  const { allAuctions } = useAuctionHouse();

  const columnHelper = createColumnHelper();

  const activeColumns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "#",
        /**
         * @description Generates a link to the auction details page for the specific value
         * provided.
         * 
         * @param { object } info - value of an auction, which is used to generate a link to
         * the corresponding auction page.
         * 
         * @returns { href` value } a clickable Link element with the value of the `info.getValue()`
         * property as its text content.
         * 
         * 	* The `href` property is a string that contains the URL of the auction page for
         * the item with the given value.
         * 	* The `className` property is a string that represents the class name of the link
         * element. In this case, it is set to `"link link-primary"`.
         * 	* The inner HTML of the link element is set to the value of the `info` object,
         * which contains the text to display on the link.
         */
        cell: (info) => {
          return (
            <Link href={`/auction/${info.getValue()}`} className="link link-primary">
              {info.getValue()}
            </Link>
          );
        },
      }),
      columnHelper.accessor("tag", {
        header: t("tag"),
        cell: (info) => <Tag tag={info.getValue()} />,
      }),
      columnHelper.accessor("amount", {
        header: t("current bid"),
        /**
         * @description Evaluates the value of an auction, displaying the auction's current
         * time or the bid price if the time is 0.
         * 
         * @param { object } info - row object from the dataframe and is used to retrieve the
         * original value of the "startTime" column.
         * 
         * @returns { string } the time value of an auction start time, displayed in a concise
         * manner as "—" or a currency value in ETH.
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return auction.startTime === 0 ? "—" : `${toEth(info.getValue(), 5)} ETH`;
        },
      }),
      columnHelper.accessor("bidder.id", {
        header: t("bidder"),
        /**
         * @description Truncates a date value to a maximum length of 13 characters and inserts
         * a hyphen if the input is 0.
         * 
         * @param { `Row`. } info - `auction` object, which is then converted to a string
         * using the `Truncate()` function with the `value` parameter being the original value
         * of the `startTime` property, and the `length` parameter set to 13 characters, with
         * the middle character chopped off if the value exceeds this length.
         * 
         * 	* `const auction = info.row.original as any;` - This line destructures the `info`
         * object into its component parts, where `auction` is a specific property of `info`.
         * The `as any` keyword allows for any type of value to be assigned to this property.
         * 	* `return auction.startTime === 0 ? "—" : Truncate(info.getValue(), 13, "middle");`
         * - This line returns the `startTime` property of the `auction` object, and if it
         * is equal to zero, returns an ellipsis (`"—"`). Otherwise, it truncates the
         * `getValue()` property of the `auction` object to a maximum of 13 characters in the
         * middle and returns the result.
         * 
         * @returns { string } a truncated date string with a maximum of 13 characters and a
         * middle padding.
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return auction.startTime === 0 ? "—" : Truncate(info.getValue(), 13, "middle");
        },
      }),
      columnHelper.accessor("endTime", {
        header: t("time left"),
        /**
         * @description Generates high-quality documentation for given code, without repeating
         * the question, using first-person statements, or making up answers. It returns an
         * `<AuctionTimer>` component based on the provided `auction` value.
         * 
         * @param { Row. } info - row of data in the database that contains the information
         * necessary to render the Auction Timer component.
         * 
         * 	* `info`: The input data from Airtable, represented as an object.
         * 	* `row`: An property of `info`, which contains the original row data from Airtable
         * as a JSON-like object.
         * 	* `original`: A property of `info.row`, which represents the raw, original data
         * from Airtable as a JSON object.
         * 
         * @returns { Component } an HTML element of type "AuctionTimer".
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return <AuctionTimer auction={auction} />;
        },
      }),
      columnHelper.accessor("id", {
        header: "",
        /**
         * @description Generates high-quality documentation for given code, returning an
         * AuctionActions component with customizable button classes.
         * 
         * @param { object } info - row object of an auction in a table format, providing
         * access to the `original` property containing information about the auction.
         * 
         * @returns { HTMLButtonElement } an AuctionActions component with customizable button
         * classes.
         * 
         * 	* `auction`: The `auction` property is an instance of the `AuctionActions`
         * component, which is a functional component that generates high-quality documentation
         * for code.
         * 	* `key`: The `key` property is a string value that is used to identify the element
         * in the React tree. It is passed as a parameter to the `AuctionActions` component
         * when it is created.
         * 	* `original`: The `original` property is an instance of the `auction` object,
         * which contains information about the auction, such as its ID and status. This
         * information is used by the `AuctionActions` component to generate documentation
         * for the code.
         */
        cell: (info) => {
          const auction = info.row.original as any;
          return (
            <AuctionActions key={info.getValue()} auction={auction} buttonClasses="btn-primary btn-outline btn-sm" />
          );
        },
      }),
    ],
    [t],
  );

  const settledColumns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "#",
        /**
         * @description Generates a hyperlink to an auction with the value of the `info`
         * object as the link text.
         * 
         * @param { string } info - value of an auction, which is linked to a page with the
         * same value.
         * 
         * @returns { hyperlink } a clickable link to the corresponding auction page.
         * 
         * 	The return value is `<Link>` element with a href attribute set to
         * `/auction/{info.getValue()}` and a className attribute set to "link link-primary".
         */
        cell: (info) => {
          return (
            <Link href={`/auction/${info.getValue()}`} className="link link-primary">
              {info.getValue()}
            </Link>
          );
        },
      }),
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

  if (!allAuctions || allAuctions.length === 0) {
    return <Layout>Loading auctions...</Layout>;
  }

  const settledAuctions = allAuctions.filter((auction) => auction.settled);
  const activeAuctions = allAuctions
    .filter((auction) => auction.startTime === 0 || auction.settled === false)
    .sort((a, b) => b.id - a.id);

  return (
    <Layout>
      <TanstackTable
        columns={activeColumns}
        data={activeAuctions}
        loading={!activeAuctions.length}
        title={t("active")}
        rowLink={(auction) => `/auction/${auction.id}`}
      />
      {/**
       * @description Displays a table with settled auction data, including auction ID,
       * title, and link to the corresponding auction page.
       * 
       * @param { column. } columns - list of auctions for which the function will generate
       * documentation, as determined by the value of `data`.
       * 
       * 	* `columns`: An array of objects, where each object represents a column in the table.
       * 	* `loading`: A boolean indicating whether there are still auctions to be loaded
       * (False by default).
       * 
       * @param { array } data - auctions that are settled, and it is passed to the
       * `TanstackTable` component as an array of objects containing the auction ID, title,
       * and other relevant information.
       * 
       * @param { boolean } loading - state of the data, indicating whether the data has
       * been settled or not.
       * 
       * @param { string } title - displayed text in the top bar of the table, typically
       * providing a brief label or title for the table.
       * 
       * @param { hyperlink. } rowLink - hyperlink for each row in the table, which directs
       * to the detailed information of the corresponding auction when clicked.
       * 
       * 	* `(auction) => `/auction/${auction.id}`: This is a React Hook Function that
       * renders a link to the auction details page for each auction item. The link is
       * constructed by concatenating the `auction.id` with the URL path `/auction/`.
       */}
      <TanstackTable
        columns={settledColumns}
        data={settledAuctions}
        loading={!settledAuctions.length}
        title={t("settled")}
        rowLink={(auction) => `/auction/${auction.id}`}
      />
      {/**
       * @description Provides information about tags and their usage, including the owner
       * and relayer ID, creation timestamp, and tagging records count.
       * 
       * @param { string } title - title of the data column displayed in the grid and sets
       * the display text for each column in the output.
       * 
       * @param { Tag[]. } tags - 0..n tag objects that are being displayed alongside their
       * respective created timestamps, owner IDs, and relayer IDs, along with the number
       * of tagging records they have applied to, all in a tabular format.
       * 
       * 	* `tag`: Each tag is represented as a Tag component, showing the tag name and the
       * timestamp when the tag was created.
       * 	* `timestamp`: The timestamp when each tag was created, presented in the format
       * of "a few minutes ago" or "x days/hours/minutes ago" using the TimeAgo library.
       * 	* `owner.id`: The ID of the user who created each tag, truncated to 13 characters
       * in the middle.
       * 	* `relayer.id`: The ID of the relayer who applied each tag, truncated to 13
       * characters in the middle.
       * 	* `tagging records`: A count of how many tagging records are associated with each
       * tag.
       * 
       * @param { boolean } rowLink - whether or not to display links for rows.
       * 
       * @param { object } columnsConfig - 6 column configurations needed to display data
       * effectively, where each configuration defines a column with specified fields,
       * formatter functions, and display names for customization purposes.
       */}
      <Tags
        title={t("upcoming")}
        tags={tags}
        rowLink={false}
        columnsConfig={[
          { title: "tag", field: "tag", formatter: (_: any, tag: any) => <Tag tag={tag} /> },
          { title: "created", field: "timestamp", formatter: (value: any) => <TimeAgo date={value * 1000} /> },
          { title: t("owner"), field: "owner.id", formatter: (value: any) => Truncate(value, 13, "middle") },
          { title: t("relayer"), field: "relayer.id", formatter: (value: any) => Truncate(value, 13, "middle") },
          { title: "tagging records", field: "tagAppliedInTaggingRecord" },
        ]}
      />
    </Layout>
  );
};

export default Auction;
