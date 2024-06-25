import { useMemo, useState } from "react";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { timestampToString } from "@app/utils";
import { toEth } from "@app/utils";
import useNumberFormatter from "@app/hooks/useNumberFormatter";
import { useCreators } from "@app/hooks/useCreators";
import Layout from "@app/layouts/default";
import { Truncate } from "@app/components/Truncate";
import { TanstackTable } from "@app/components/TanstackTable";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { CopyAndPaste } from "@app/components/CopyAndPaste";

const pageSize = 20;

/**
 * @description Creates a React component for displaying data from a Tanstack table,
 * using the `useTranslation`, `useNumberFormatter`, and `useCreators` hooks to fetch
 * data from an API. The component sets up a Layout, creates columns with accessor
 * functions, and renders the table with pagination functionality.
 * 
 * @returns { Component } a Tanstack Table component displaying creators' information
 * with custom columns and data fetched from an API.
 */
const Creators: NextPage = () => {
  const { t } = useTranslation("common");
  const [pageIndex, setPageIndex] = useState(0);
  const { number } = useNumberFormatter();
  const { creators, nextCreators } = useCreators({
    pageSize,
    skip: pageIndex * pageSize,
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  });

  const columnHelper = createColumnHelper();

  const columns = useMemo<any[]>(
    () => [
      columnHelper.accessor("id", {
        header: t("creator"),
        /**
         * @description Returns an HTML component that displays the creator's name and provides
         * links for viewing the creator's profile and copying the creator's value.
         * 
         * @param { object } info - data from a database row, which is then used to generate
         * high-quality documentation for the code.
         * 
         * @returns { HTML content` or an interactive element when evaluated as an expression,
         * according to the given code snippet provided in the problem statement } a HTML
         * component containing a link and a copy-and-paste button for the given value.
         * 
         * 	* `creator`: The creator object that represents the person whose profile is being
         * displayed.
         * 	* `href`: A hyperlink to the creator's profile page.
         * 	* `className`: The class name of the hyperlink element.
         * 	* `value`: The value of the cell, which in this case is a string representing the
         * creator's full name.
         */
        cell: (info) => {
          const creator = info.row.original as any;
          return (
            <>
              <Link href={`/creators/${creator.id}`} className="link link-primary">
                {Truncate(info.getValue())}
              </Link>
              <CopyAndPaste value={info.getValue()} />
            </>
          );
        },
      }),
      columnHelper.accessor("firstSeen", {
        header: t("first-seen"),
        cell: (info) => timestampToString(parseInt(info.getValue())),
      }),
      columnHelper.accessor("tagsCreated", {
        header: t("tags-created"),
        cell: (info) => number(parseInt(info.getValue())),
      }),
      columnHelper.accessor("revenue", {
        header: t("revenue"),
        cell: (info) => `${toEth(info.getValue(), 4)} MATIC`,
      }),
    ],
    [t, number],
  );

  return (
    <Layout>
      {/**
       * @description Provides a table with information about creators, including their
       * names and numbers of works.
       * 
       * @param { array } columns - column data for display in the table, and its value is
       * used to determine the columns displayed in the table.
       * 
       * @param { object } data - creators array that is displayed on the table.
       * 
       * @param { boolean } loading - whether the creators array is fully populated or not.
       * 
       * @param { number } rowsPerPage - number of creators to display on each page.
       * 
       * @param { boolean } hasNextPage - presence or absence of additional creators beyond
       * those currently displayed, indicating whether there are more creators to be loaded
       * from the API when the user navigates forward.
       * 
       * @param { integer } pageIndex - 0-based index of the current page being displayed,
       * allowing the component to display only the relevant rows of data.
       * 
       * @param { number } setPageIndex - current page index that can be updated to change
       * the display of creators in the table.
       * 
       * @param { function reference. } rowLink - hyperlink to the creator profile when
       * clicked, which is passed as a function `(creator: any) => `/creators/${creator.id}`
       * 
       * 	* `(creator: any)`: This is the value of the current row's creator object, which
       * contains information about the creator of a particular item.
       * 	* `/creators/${creator.id}`: This is the URL that can be used to navigate to the
       * details page for the creator with the specified `id`.
       */}
      <TanstackTable
        columns={columns}
        data={creators}
        loading={!creators?.length}
        rowsPerPage={pageSize}
        hasNextPage={!!nextCreators?.length}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        rowLink={(creator: any) => `/creators/${creator.id}`}
      />
    </Layout>
  );
};

export default Creators;
