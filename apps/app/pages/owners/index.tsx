import { useMemo, useState } from "react";
import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useOwners } from "@app/hooks/useOwners";
import Layout from "@app/layouts/default";
import { TimeAgo } from "@app/components/TimeAgo";
import { Truncate } from "@app/components/Truncate";
import { TanstackTable } from "@app/components/TanstackTable";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { CopyAndPaste } from "@app/components/CopyAndPaste";
import useNumberFormatter from "@app/hooks/useNumberFormatter";

const pageSize = 20;

/**
 * @description Generates high-quality documentation for code given to it, without
 * repeating the question or using first-person statements. It uses the `useTranslation`,
 * `useNumberFormatter`, and `useOwners` hooks to fetch data from the backend and
 * create a TanstackTable component with the necessary columns and data.
 * 
 * @returns { HTML element } a React layout component that renders a table displaying
 * owner information.
 * 
 * 	1/ `columns`: An array of column helpers created using `createColumnHelper()`.
 * Each column helper represents a column in the table and contains an accessor
 * function for fetching the data. The functions are decorated with `columnHelper`
 * to indicate they are custom columns.
 * 	2/ `data`: An array of objects containing information about the owners. Each
 * object has properties `id`, `firstSeen`, and `tagsOwned`.
 * 	3/ `loading`: A boolean indicating whether there is any data to display (i.e., `!owners?.length`).
 * 	4/ `rowsPerPage`: An integer representing the number of owners to display per page.
 * 	5/ `hasNextPage`: A boolean indicating whether there are more owners beyond the
 * current page (`!!nextOwners?.length`).
 * 	6/ `pageIndex`: An integer representing the current page number (0-based indexing).
 * 	7/ `setPageIndex`: A function to update the page index.
 * 	8/ `rowLink`: A function to create a link to a specific owner's profile (`/owners/${owner.id}`).
 * 
 * 	Overall, the output of the `<anonymous>` function is an React component that
 * renders a table displaying information about a collection of owners. The component
 * includes buttons to navigate between pages and a `rowLink` to view an owner's
 * profile in detail.
 */
const Owners: NextPage = () => {
  const { t } = useTranslation("common");
  const [pageIndex, setPageIndex] = useState(0);
  const { number } = useNumberFormatter();
  const { owners, nextOwners } = useOwners({
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
        header: t("owner"),
        /**
         * @description Generates a link and copy/paste button for displaying the value of
         * an owner's ID.
         * 
         * @param { information row. } info - row of data to be processed, providing access
         * to the `owner` object and the value of the field being displayed through the
         * `getValue()` method.
         * 
         * 	* `owner`: The `owner` property is of type `any`, indicating that it can be any
         * value, and is the original owner of the value being displayed.
         * 	* `row`: The `row` property is an object representing the row containing the value
         * being displayed.
         * 	* `getValue`: The `getValue` property is a string or any other value type,
         * representing the value to be displayed.
         * 
         * @returns { HTML fragment containing a link and a copy-and-paste functionality for
         * the given value } a component that displays the owner's name and truncated value,
         * along with buttons for copying and pasting the value.
         * 
         * 	* `<Link>` component: This element displays a link to the owner's profile page.
         * The `href` attribute is set to `/owners/${owner.id}`, which navigates to the owner's
         * profile page when clicked. The `className` attribute is set to `link link-primary`,
         * which styles the link as primary and adds the "link" class for styling.
         * 	* `<CopyAndPaste>` component: This element allows users to copy the value of the
         * `info.getValue()` property. The `value` attribute is set to the value returned by
         * `info.getValue()`, which is the owner's name.
         */
        cell: (info) => {
          const owner = info.row.original as any;
          return (
            <>
              <Link href={`/owners/${owner.id}`} className="link link-primary">
                {Truncate(info.getValue())}
              </Link>
              <CopyAndPaste value={info.getValue()} />
            </>
          );
        },
      }),
      columnHelper.accessor("firstSeen", {
        header: t("first-seen"),
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
      columnHelper.accessor("tagsOwned", {
        header: t("tags-owned", { timeframe: t("current") }),
        cell: (info) => number(parseInt(info.getValue())),
      }),
    ],
    [t, number],
  );

  return (
    <Layout>
      {/**
       * @description Provides a table with columns, data, loading state, and pagination
       * functionality for displaying owner information.
       * 
       * @param { array } columns - columns displayed by the table.
       * 
       * @param { array } data - data to be displayed on the table.
       * 
       * @param { boolean } loading - boolean state of whether there are no owners in the
       * data, indicating whether the component should show a "Loading" message or not.
       * 
       * @param { integer } rowsPerPage - number of owners that will be displayed per page
       * when rendering the table.
       * 
       * @param { boolean } hasNextPage - existence of more owners beyond those displayed
       * on the current page, allowing for pagination and display of multiple pages of owner
       * information.
       * 
       * @param { integer } pageIndex - 0-based index of the current page of data being
       * displayed within the table, allowing for navigation to previous or next pages
       * through calls to the `setPageIndex()` function.
       * 
       * @param { number } setPageIndex - 2-tuple of page number and list length for updating
       * the display pages.
       * 
       * @param { hyperlink function. } rowLink - path for linking to an owner's detail
       * page when clicking on a row in the table display.
       * 
       * 	* `(owner: any)`: The type of the `rowLink` parameter is inferred as `any`,
       * indicating that it can take any value, including null or undefined.
       * 	* `/owners/${owner.id}`: This is the URL generated for each row in the table. It
       * takes the `owner.id` as a parameter and generates a URL based on it.
       */}
      <TanstackTable
        columns={columns}
        data={owners}
        loading={!owners?.length}
        rowsPerPage={pageSize}
        hasNextPage={!!nextOwners?.length}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        rowLink={(owner: any) => `/owners/${owner.id}`}
      />
    </Layout>
  );
};

export default Owners;
