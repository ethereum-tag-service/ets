import { useMemo, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { globalSettings } from "@app/config/globalSettings";
import { useTaggingRecords } from "@app/hooks/useTaggingRecords";
import { TimeAgo } from "./TimeAgo";
import { TanstackTable } from "./TanstackTable";
import { Tag } from "./Tag";
import { createColumnHelper } from "@tanstack/react-table";
import { CopyAndPaste } from "./CopyAndPaste";
import { Truncate } from "./Truncate";

type Props = {
  filter?: any;
  pageSize?: number;
  orderBy?: string;
  title?: string;
};

/**
 * @description Generates high-quality documentation for code given to it. It uses
 * the `useTaggingRecords` hook to fetch tagging records and their metadata, then
 * maps over the records to create a table with columns for ID, timestamp, relayer,
 * record type, target, and tags. The resulting table is displayed with pagination
 * controls and links to view individual records.
 * 
 * @param { filter. } .filter - filter to apply on the tagging records before they
 * are displayed.
 * 
 * 	* `filter`: This is the main property passed to the component as an argument,
 * which represents a filter object with various properties and attributes.
 * 	* `pageSize`: This is an integer property that represents the number of items to
 * display on each page. It is set to the default value of 50 by the
 * `globalSettings["DEFAULT_PAGESIZE"]` constant.
 * 	* `orderBy`: This is a string property that specifies the field by which the data
 * should be sorted. It can be either a date format string (e.g., "created") or a
 * custom attribute name (e.g., "relayer").
 * 	* `title`: This is a string property that represents the title of the table. It
 * is used to render a heading above the table contents.
 * 	* `taggingRecords`: This is an array property that contains all the tagging records
 * deserialized from the input JSON data.
 * 	* `nextTaggingRecords`: This is an optional array property that contains the next
 * set of tagging records, if any, that can be displayed on the next page. It is only
 * populated when there are more than 50 tagging records available for display.
 * 
 * 	Note: The properties and attributes of the `.filter` object are not explicitly
 * listed in the function code snippet provided. However, based on the function's
 * purpose and signature, it can be inferred that `.filter` must have properties
 * representing various filtering options (e.g., by `relayer`, `recordType`, `target`),
 * as well as attributes such as `pageSize`, `orderBy`, etc.
 * 
 * @param { subscript_expression } .pageSize - number of tagging records to display
 * per page, and is used to control the display range of the tagging records.
 * 
 * @param { string } .orderBy - 0-based index of the field to use for sorting the
 * TaggingRecords, and when set, it determines the sort order of the TaggingRecords.
 * 
 * @param { string } .title - title of the table and is used to set the title of the
 * table component.
 * 
 * @returns { JSX.Element } a TanstackTable component that displays tagging records.
 * 
 * 	1/ `const { t } = useTranslation("common")`: This line imports the `t` function
 * from the `useTranslation()` hook and assigns it to a variable named `t`. The `t`
 * function is used for translating strings in the component.
 * 	2/ `const { taggingRecords, nextTaggingRecords } = useTagging Records({ ... })`:
 * This line imports the `useTaggingRecords()` hook and passes an object as its
 * argument. The hook returns two values: `taggingRecords` and `nextTaggingRecords`.
 * These are the data arrays of Tagging Records and the next set of records to be
 * fetched, respectively.
 * 	3/ `const columnHelper = createColumnHelper()`: This line creates a new instance
 * of the `columnHelper` class. The `createColumnHelper()` function is not explicitly
 * shown in the code snippet provided, but it likely creates a helper function that
 * can be used to build and customize tables.
 * 	4/ `const columns = useMemo<any[]>(() => [...])`: This line uses the `useMemo()`
 * hook to create an array of columns for the table. The array is defined using a
 * lambda function that returns an array of objects, each representing a column in
 * the table. Each object in the array has properties such as `accessor`, `header`,
 * and `cell`, which define how the column will appear in the table.
 * 	5/ `const { taggingRecord: any } = useRowData()`: This line uses the `useRowData()`
 * hook to get a single row of data for the current Tagging Record. The row is assigned
 * to the `taggingRecord` variable, which can be used further down in the code to
 * render the table cells.
 * 	6/ `return (...)`: This line returns a TanstackTable component, which is responsible
 * for rendering the table based on the `columns` array and the `taggingRecords` data
 * array. The `TanstackTable` component takes various props such as `columns`, `data`,
 * `loading`, `rowsPerPage`, `title`, and `rowLink`, which are used to customize the
 * appearance and behavior of the table.
 * 
 * 	Overall, the output returned by the `<anonymous>` function is a TanstackTable
 * component that displays a list of Tagging Records with various columns of information.
 * The columns are customized using lambdas and the `useTranslation()` hook, and the
 * `TanstackTable` component is responsible for rendering the table based on the
 * provided data and props.
 */
const TaggingRecords: NextPage<Props> = ({ filter, pageSize = globalSettings["DEFAULT_PAGESIZE"], orderBy, title }) => {
  const { t } = useTranslation("common");
  const [pageIndex, setPageIndex] = useState(0);

  const { taggingRecords, nextTaggingRecords } = useTaggingRecords({
    filter: filter,
    pageSize: pageSize,
    skip: pageIndex * pageSize,
    orderBy: orderBy,
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 1000,
    },
  });

  const columnHelper = createColumnHelper();

  const columns = useMemo<any[]>(
    () => [
      columnHelper.accessor("id", {
        header: t("id"),
        /**
         * @description Provides a link to view more information about an item and displays
         * its truncated label when interacted with, as well as its value when copied or pasted.
         * 
         * @param { object } info - tagging records to be displayed in the component.
         * 
         * @returns { HTMLHint` link element } a clickable link and a copy button for a given
         * value.
         * 
         * 	* `<Link>`: This component is used to generate a link with the value of
         * `info.getValue()` as the href. The link has a className of "link" and "link-primary".
         * 	* `Truncate`: This function is used to truncate the value of `info.getValue()`
         * at a maximum length of 50 characters, if necessary.
         * 	* `CopyAndPaste`: This component is used to generate a button with the value of
         * `info.getValue()` that can be copied and pasted.
         */
        cell: (info) => (
          <>
            {/**
             * @description Provides a URL for accessing a specific tagging record based on the
             * value of the `info.getValue()` variable.
             * 
             * @param { event. } onClick - event that triggers the functionality of the link,
             * causing it to navigate to the corresponding record detail page when clicked.
             * 
             * 	* `onClick`: A callback function that is called when the link is clicked.
             * 	* `(e) => { e.stopPropagation(); }`: The function stops the event from propagating
             * up the DOM tree, which means that any nested event listeners will not be called.
             * 	* `href`: A URL that the link points to.
             * 
             * @param { hyperlink. } href - URL of the tagging records to be displayed based on
             * the value passed as a prop.
             * 
             * 	* `onClick`: A function that stops the link's event from propagating up the DOM
             * tree when clicked.
             * 	* `href`: The URL or path of the linked resource, which can be a string or a
             * complex data structure depending on the input provided.
             * 	* `className`: An optional CSS class name to apply to the linked element.
             * 
             * 	The `href` property can also have additional attributes or properties, such as:
             * 
             * 	* `hrefOffset`: A number indicating the offset of the linked resource relative
             * to the original URL.
             * 	* `htmlContent`: A boolean indicating whether the link should be displayed as
             * HTML content or not.
             * 	* `follow`: A boolean indicating whether the link should follow any redirect responses.
             * 	* `method`: A string indicating the HTTP method to use when following the link
             * (defaults to 'GET').
             * 	* `headers`: An object of HTTP headers to include in the link request.
             * 
             * 	It's important to note that the properties and attributes of the `href` property
             * can vary depending on the input provided and the specific use case.
             * 
             * @param { string } className - class name of the anchor tag element being created,
             * which is used to set the CSS class of the link.
             */}
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/tagging-records/${info.getValue()}`}
              className="link link-primary"
            >
              {Truncate(info.getValue())}
            </Link>
            <CopyAndPaste value={info.getValue()} />
          </>
        ),
      }),
      columnHelper.accessor("timestamp", {
        header: t("created"),
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
      columnHelper.accessor("relayer.id", {
        header: t("relayer"),
        /**
         * @description Returns a hyperlink to the detail page of a specific relayer with the
         * ID specified in the `href` prop.
         * 
         * @param { object } info - row data of a database table, which is used to access the
         * `relayer` object properties within the function.
         * 
         * @returns { HTML Link Element } a clickable link displaying the name of the relayer
         * with an ID matching the input `relayer.id`.
         * 
         * 	* The Link component is used to create a link that directs the user to the details
         * page of the relay.
         * 	* The `onClick` event handler is used to stop the propagation of the event, which
         * is necessary to prevent the default behavior of the link (i.e., navigating to the
         * destination URL).
         * 	* The `href` attribute is used to specify the URL of the link, which is in the
         * format `/relayers/<relayer.id>`.
         * 	* The `className` attribute is used to add a class name to the Link component,
         * which in this case is "link-primary".
         */
        cell: (info) => {
          const relayer = (info.row.original as any).relayer;
          return (
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/relayers/${relayer.id}`}
              className="link link-primary"
            >
              {relayer.name}
            </Link>
          );
        },
      }),
      columnHelper.accessor("recordType", {
        header: t("record-type"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("target.id", {
        header: t("target"),
        /**
         * @description Generates high-quality documentation for code based on provided information.
         * 
         * @param { any } info - value to be displayed as a link or copy and paste functionality
         * in the function.
         * 
         * @returns { HTMLContent } a clickable link with a truncated version of the input value.
         * 
         * 	The `<Link>` element contains a href attribute with the value `/targets/${info.getValue()}`
         * , which is a URL pointing to the targets data page for the specified value of
         * `info.getValue()`. The `className` attribute is set to `'link link-primary'`,
         * indicating that the link is primary and should be styled accordingly.
         * 
         * 	The `<CopyAndPaste>` element contains a `value` attribute with the same value as
         * the `href` attribute, which is the value of `info.getValue()`. This allows users
         * to copy the value to their clipboard with a single click.
         */
        cell: (info) => (
          <>
            {/**
             * @description Generates high-quality documentation for given code.
             * 
             * @param { anchor link element event. } onClick - event triggered when the link is
             * clicked, stopping its propagation and navigating to the URL associated with the
             * link's `href` prop.
             * 
             * 	* `onClick`: It is an event handler function that is triggered when the link is
             * clicked.
             * 	* `stopPropagation()`: This function stops the default behavior of the link from
             * propagating to the parent element.
             * 
             * @param { hyperlink URL reference. } href - URL of a target page related to the
             * value of the `info` object, and is used to construct a clickable link for the user
             * to access that page.
             * 
             * 	* `onClick`: An event handler that stops the link's default behavior of navigating
             * to the linked page when clicked.
             * 	* `href`: The URL of the linked page. It is a string that can be modified or
             * passed to other functions as needed.
             * 	* `className`: A string that specifies a CSS class name for the link element. It
             * can be used to add styles or change the appearance of the link.
             * 
             * 	In summary, the `Link` function takes in a serialized value, deserializes it into
             * a linked page URL, and then modifies the `href` property with the corresponding URL.
             * 
             * @param { string } className - CSS class to apply to the linking element when the
             * link is clicked.
             */}
            <Link
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/targets/${info.getValue()}`}
              className="link link-primary"
            >
              {Truncate(info.getValue())}
            </Link>
            <CopyAndPaste value={info.getValue()} />
          </>
        ),
      }),
      columnHelper.accessor("tags", {
        header: t("tags"),
        /**
         * @description Maps the provided value to an array of HTML tags, each representing
         * a single tag within the larger structure of the original value.
         * 
         * @param { any } info - array of values to be rendered as tags, and it is used to
         * map over the array and create the HTML elements for each tag.
         * 
         * @returns { any } a list of clickable tags, each representing a single value from
         * an array.
         */
        /**
         * @description Maps an array of objects `info.getValue()` and displays each object
         * as a small `Tag` component using its own unique `key` value for proper identification
         * and avoiding duplicates.
         * 
         * @param { object } onClick - event listener that will be triggered when the element
         * is clicked, stopping any further propagation of the event.
         */
        cell: (info) => (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {(info.getValue() as any[]).map((tag: any, i: number) => (
              <span key={i} className="mr-2 pb-2 inline-block">
                <Tag tag={tag} />
              </span>
            ))}
          </div>
        ),
      }),
    ],
    [t],
  );

  return (
    <TanstackTable
      columns={columns}
      data={taggingRecords}
      loading={!taggingRecords?.length}
      rowsPerPage={pageSize}
      title={title}
      rowLink={(taggingRecord: any) => `/tagging-records/${taggingRecord.id}`}
      hasNextPage={!!nextTaggingRecords?.length}
      pageIndex={pageIndex}
      setPageIndex={setPageIndex}
    />
  );
};

export { TaggingRecords };
