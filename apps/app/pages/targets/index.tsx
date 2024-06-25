import { useMemo, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { useTargets } from "@app/hooks/useTargets";
import Layout from "@app/layouts/default";
import { TimeAgo } from "@app/components/TimeAgo";
import { TanstackTable } from "@app/components/TanstackTable";
import { createColumnHelper } from "@tanstack/react-table";
import { CopyAndPaste } from "@app/components/CopyAndPaste";
import { URI } from "@app/components/URI";
import { Truncate } from "@app/components/Truncate";

const pageSize = 20;

/**
 * @description Generates high-quality documentation for code given to it by using
 * React Hooks and Tanstack library. It defines columns and rows, fetches data from
 * an API, and renders a table with custom links for each target.
 * 
 * @returns { HTML `div` element } a TanstackTable component with columns and data
 * fetched from an API.
 * 
 * 	`const columns = useMemo<any[]>(() => [...]);`: This line defines an array of
 * column helpers using the `useMemo` hook. The `useMemo` hook is used to memoize the
 * creation of the columns, which means that the code will only be executed once when
 * the component mounts, and the results will be stored in a memory cache for subsequent
 * calls.
 * 
 * 	`columns`: This is an array of column helpers, each of which contains an accessor
 * function for a specific column in the table. The `useMemo` hook ensures that the
 * columns are only created once when the component mounts.
 * 
 * 	`columnHelper`: This is a variable that contains a function that returns an
 * accessor function for a specific column in the table. The accessor function takes
 * the row object as an argument and returns a React component that renders the value
 * of the column.
 * 
 * 	`createColumnHelper()`: This is a function that creates a new `columnHelper`
 * instance. It returns a new function that can be used to create a column helper for
 * a specific column in the table.
 * 
 * 	`Truncate`: This is a utility function that truncates a string to a maximum length.
 * It takes three arguments: the string to truncate, the maximum length, and an
 * optional `middle` argument that specifies whether the string should be truncated
 * in the middle or at the end.
 * 
 * 	`TimeAgo`: This is a React component that renders a timestamp with a human-readable
 * format. It takes one argument: the timestamp value.
 * 
 * 	`CopyAndPaste`: This is a React component that allows the user to copy the value
 * of a cell to the clipboard. It takes one argument: the cell value.
 * 
 * 	`URI`: This is a React component that renders a hyperlink to the specified URL.
 * It takes two arguments: the URL and an optional `text` argument that specifies the
 * text to display in the link.
 * 
 * 	`<TanstackTable>...</TanstackTable>`: This is a Tanstack table component that
 * renders a table with the specified columns. It takes several arguments:
 * 
 * 	* `columns`: An array of column helpers, each containing an accessor function for
 * a specific column in the table.
 * 	* `data`: An array of target objects that will be displayed in the table.
 * 	* `loading`: A boolean value indicating whether the data is loading.
 * 	* `rowsPerPage`: The number of rows to display per page.
 * 	* `hasNextPage`: A boolean value indicating whether there are more pages of data
 * available.
 * 	* `pageIndex`: An integer value representing the current page number.
 * 	* `setPageIndex`: A function that can be used to update the page index.
 * 	* `rowLink`: A function that can be used to navigate to a target object in the list.
 * 
 * 	Overall, this code creates a table component that displays a list of targets with
 * various columns, including an ID column, a created column, and a URI column. The
 * `useMemo` hook is used to memoize the creation of the columns, which reduces the
 * number of re-renders and improves performance.
 */
const Targets: NextPage = () => {
  const { t } = useTranslation("common");
  const [pageIndex, setPageIndex] = useState(0);
  const { targets, nextTargets } = useTargets({
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
        header: t("id"),
        /**
         * @description Takes an `info` object as input and returns a link to the target
         * record's detail page, generated using the `href` property of the link component.
         * The link text is created by truncating the value property of the target record
         * with a maximum length of 24 characters and a middle position.
         * 
         * @param { object } info - row data of the dataset and provides the original value
         * of the target field to be truncated and linked.
         * 
         * @returns { HTMLLinkElement } a clickable link with the truncated value of the `target.id`.
         * 
         * 	* `target`: The target object is the original data object passed as an argument
         * to the `cell` function. It has the property `id`, which is the unique identifier
         * of the target object.
         * 	* `href`: The `href` property is a string that contains the URL path of the link.
         * In this case, it points to the `/targets/<target.id>` path, where `<target.id>`
         * is the ID of the target object.
         */
        cell: (info) => {
          const target = info.row.original as any;
          return (
            <Link href={`/targets/${target.id}`} className="link link-primary">
              {Truncate(info.getValue(), 24, "middle")}
            </Link>
          );
        },
      }),
      columnHelper.accessor("created", {
        header: t("created"),
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
      columnHelper.accessor("targetURI", {
        header: t("URI"),
        /**
         * @description Generates high-quality documentation for code given to it, providing
         * the value of the cell, a copy and pasteable value, and a universal resource locator
         * (URI) for the code.
         * 
         * @param { string } info - value of the code that is given to generate high-quality
         * documentation.
         * 
         * @returns { string } a HTML element containing the value of the given code snippet.
         */
        cell: (info) => (
          <div>
            <span className="line-clamp-1">{info.getValue()}</span>
            <CopyAndPaste value={info.getValue()} />
            <URI value={info.getValue()} />
          </div>
        ),
      }),
    ],
    [t],
  );

  return (
    <Layout>
      <div className="col-span-12 max-w-screen-lg">
        {/**
         * @description Renders a table displaying information from an array of objects, with
         * options for loading more rows and navigating between pages.
         * 
         * @param { array } columns - 0-based index of the table columns for which to display
         * data in the provided table component.
         * 
         * @param { object } data - targets for which to generate documentation, as provided
         * by the caller through the `targets` variable.
         * 
         * @param { boolean } loading - boolean value whether there are no targets to display,
         * indicating that the component should render a loading state until more targets are
         * retrieved.
         * 
         * @param { number } rowsPerPage - number of targets to display on each page of the
         * table, and is used to determine how many rows are visible in the table at any given
         * time.
         * 
         * @param { boolean } hasNextPage - whether there are more targets beyond the current
         * page, allowing the function to toggle the display of a "Next Page" button based
         * on its value.
         * 
         * @param { integer } pageIndex - 0-based index of the current page being displayed
         * in the targets table, and is used to determine which row of the table is currently
         * visible.
         * 
         * @param { number } setPageIndex - 0-based index of the current page of data to be
         * displayed, allowing for updates to the current page number during operation.
         * 
         * @param { string } rowLink - URL of the target's details page.
         */}
        <TanstackTable
          columns={columns}
          data={targets}
          loading={!targets?.length}
          rowsPerPage={pageSize}
          hasNextPage={!!nextTargets?.length}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          rowLink={(target: any) => `/targets/${target.id}`}
        />
      </div>
    </Layout>
  );
};

export default Targets;
