import { useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { globalSettings } from "@app/config/globalSettings";
import { useTaggers } from "@app/hooks/useTaggers";
import Layout from "@app/layouts/default";
import { TanstackTable } from "@app/components/TanstackTable";
import { createColumnHelper } from "@tanstack/react-table";
import { CopyAndPaste } from "@app/components/CopyAndPaste";
import Link from "next/link";
import useNumberFormatter from "@app/hooks/useNumberFormatter";

const pageSize = 20;

/**
 * @description Uses React hooks and Tanstack API to display a table of taggers with
 * relevant details, including the ability to view more records and navigate between
 * pages. It takes no arguments.
 * 
 * @returns { Component } a Tanstack Table component with Taggers data and navigation
 * functionality.
 */
const Taggers: NextPage = () => {
  const { t } = useTranslation("common");
  const [pageIndex, setPageIndex] = useState(0);
  const { number } = useNumberFormatter();
  const { taggers, nextTaggers } = useTaggers({
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
        header: t("tagger"),
        /**
         * @description Generates a link and a copy-and-paste button for displaying the
         * `tagger.id` value.
         * 
         * @param { object } info - tagger object that is passed as the second argument to
         * the `return` statement, and it is used to access properties of the object such as
         * `original` and `getValue`.
         * 
         * @returns {  } a HTML fragment containing a link and a copy/paste button for the
         * provided value.
         * 
         * 	* `<Link>`: This component renders a clickable link to the tagger's profile page.
         * The `href` prop is set to `/taggers/${tagger.id}`, which routes the user to the
         * tagger's profile page.
         * 	* `<CopyAndPaste>`: This component displays a copy button next to the value
         * rendered by the `cell`. When clicked, it copies the value to the clipboard.
         */
        cell: (info) => {
          const tagger = info.row.original as any;
          return (
            <>
              <Link href={`/taggers/${tagger.id}`} className="link link-primary">
                {info.getValue()}
              </Link>
              <CopyAndPaste value={info.getValue()} />
            </>
          );
        },
      }),
      columnHelper.accessor("taggingRecordsCreated", {
        header: t("tagging-records"),
        cell: (info) => number(parseInt(info.getValue())),
      }),
    ],
    [t, number],
  );

  return (
    <Layout>
      <div className="col-span-12">
        {/**
         * @description Displays information about taggers with columns for their name,
         * description, and more. It loads data from an API based on user input and displays
         * pagination links when there are more results available.
         * 
         * @param { array } columns - array of column labels for the table display.
         * 
         * @param { object } data - taggers array that is passed to the TanstackTable component.
         * 
         * @param { boolean } loading - status of the Taggers data, indicating whether it is
         * being loaded or not.
         * 
         * @param { integer } rowsPerPage - number of taggers that will be displayed per page
         * in the tagger table.
         * 
         * @param { boolean } hasNextPage - presence or absence of additional taggers beyond
         * what is currently displayed, and indicates whether there are more taggers to be
         * displayed on the subsequent page.
         * 
         * @param { integer } pageIndex - 0-based index of the current page being displayed
         * in the Taggers list, and is used to retrieve the appropriate subset of data from
         * the `taggers` array.
         * 
         * @param { number } setPageIndex - ability to update the current page index of
         * displayed taggers within the `Taggers` component.
         * 
         * @param { string } title - string that is displayed as the title of the component,
         * passed through the `t` function to include the translated key.
         * 
         * @param { string } rowLink - URL of each tagger, allowing for navigation to their
         * respective detail pages when clicked on.
         */}
        <TanstackTable
          columns={columns}
          data={taggers}
          loading={!taggers?.length}
          rowsPerPage={pageSize}
          hasNextPage={!!nextTaggers?.length}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          title={t("taggers")}
          rowLink={(tagger: any) => `/taggers/${tagger.id}`}
        />
      </div>
    </Layout>
  );
};

export default Taggers;
