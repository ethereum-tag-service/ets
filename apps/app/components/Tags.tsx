import type { NextPage } from "next";
import { useMemo } from "react";
import useTranslation from "next-translate/useTranslation";
import { globalSettings } from "@app/config/globalSettings";
import { TanstackTable } from "@app/components/TanstackTable";
import { TagType } from "@app/types/tag";
import { createColumnHelper } from "@tanstack/react-table";

type Props = {
  title?: string;
  pageSize?: number;
  tags: TagType[];
  columnsConfig: any[];
  rowLink: boolean;
  pageIndex?: number;
  setPageIndex?: (index: number) => void;
  hasNextPage?: boolean;
};

/**
 * @description Creates a table component for rendering tags. It uses `useMemo` to
 * memoize the `columns` array, and `createColumnHelper` to generate column accessors
 * for each tag field. The component then passes these columns to the `TanstackTable`
 * component for display.
 * 
 * @param { string } .title - title of the table displayed above the table contents,
 * passed from the parent component as an argument to the `TanstackTable` component.
 * 
 * @param { `TagType[]`. } .tags - list of tags that will be displayed in the table.
 * 
 * 	* `title`: The title of the table displayed on the top.
 * 	* `tags`: An array of tags.
 * 	* `pageSize`: The default page size for the table.
 * 	* `columnsConfig`: An array of column configurations, each containing the following
 * properties:
 * 		+ `field`: The name of the field to be displayed in the table cell.
 * 		+ `title`: The title of the column displayed on the header.
 * 		+ `formatter`: A function that formats the data for display in the table cell,
 * or undefined if no formatting is required.
 * 	* `rowLink`: A function that returns the URL for the row detail page, or undefined
 * if no link is provided.
 * 
 * @param { subscript_expression } .pageSize - default page size for the table, which
 * is used to limit the number of rows displayed per page.
 * 
 * @param { any } .columnsConfig - configuration of columns for the table, including
 * their titles, formatting, and other settings.
 * 
 * @param { string } .rowLink - tag link function for each row in the table, which
 * upon clicking, opens the tag page with the selected tag's ID as the URL parameter.
 * 
 * @param { integer } .pageIndex - 0-based index of the currently visible page of
 * data in the table, allowing the `TanstackTable` component to render only the
 * appropriate rows based on the user's pagination actions.
 * 
 * @param { number } .setPageIndex - `pageIndex` state variable of the component and
 * allows it to update the value when the component mounts or when the user navigates
 * to a new page.
 * 
 * @param { boolean } .hasNextPage - Whether there are more data to be displayed after
 * the current page, indicating whether the component should show a "Load More" button
 * or not.
 * 
 * @returns { JSX.Element } a Tanstack Table component with `tags` data, `columns`,
 * and other props.
 * 
 * 	* `const { t } = useTranslation("common")`: This line imports the `t` function
 * from the `useTranslation` hook, which is used to translate strings.
 * 	* `const columnHelper = createColumnHelper<TagType>();`: This line creates a new
 * instance of the `createColumnHelper` function, which is used to define custom
 * columns for the table. The type parameter `<TagType>` represents the type of data
 * that will be displayed in the column.
 * 	* `const columns = useMemo<any[]>(() => ...)`: This line uses the `useMemo` hook
 * to memoize an array of column objects. The `columnsConfig` property is used as an
 * argument to the function, which maps each configuration object to a new column
 * object. Each column object has three properties:
 * 		+ `header`: This property defines the title of the column. It is defined using
 * the `t` function from the `useTranslation` hook, which is used to translate strings.
 * 		+ `cell`: This property defines the cell renderer for the column. It takes two
 * arguments: `info` (which represents the row data) and `tag` (which represents the
 * current tag being displayed). The `cell` function returns a string that will be
 * displayed in the cell.
 * 		+ `formatter`: This property defines the formatter for the column. It is only
 * used if the `column.formatter` property is set to `true`. The `formatter` function
 * takes two arguments: `value` (which represents the value of the tag) and `tag`
 * (which represents the current tag being displayed). The `formatter` function returns
 * a string that will be displayed in the cell.
 * 	* `<TanstackTable ...>`: This line defines an instance of the `TanstackTable`
 * component, which is used to render the table. The properties of the returned output
 * are explained below:
 * 		+ `columns`: This property represents the array of column objects defined earlier.
 * 		+ `data`: This property represents the array of tag objects that will be displayed
 * in the table.
 * 		+ `hasNextPage`: This property represents a boolean value indicating whether
 * there is a next page of data available.
 * 		+ `loading`: This property represents a boolean value indicating whether the
 * data is still loading.
 * 		+ `rowsPerPage`: This property represents the default number of rows that will
 * be displayed per page.
 * 		+ `title`: This property represents the title of the table. It is defined using
 * the `t` function from the `useTranslation` hook, which is used to translate strings.
 * 		+ `pageIndex`: This property represents the current page index of the data. It
 * is set using the `setPageIndex` function.
 * 		+ `setPageIndex`: This property represents a function that can be used to update
 * the current page index of the data.
 * 		+ `rowLink`: This property represents a function that can be used to navigate
 * to the details page for a particular tag. It takes one argument: `tag` (which
 * represents the current tag being displayed).
 */
const Tags: NextPage<Props> = ({
  title,
  tags,
  pageSize = globalSettings["DEFAULT_PAGESIZE"],
  columnsConfig,
  rowLink,
  pageIndex,
  setPageIndex,
  hasNextPage,
}) => {
  const { t } = useTranslation("common");

  const columnHelper = createColumnHelper<TagType>();

  const columns = useMemo<any[]>(
    () =>
      columnsConfig.map((column) =>
        columnHelper.accessor(column.field, {
          header: () => t(column.title),
          /**
           * @description Generates high-quality documentation for code based on provided
           * information. It takes an object `info` containing a row and column, and returns
           * the value of the cell using a formatter if specified, otherwise returns the raw value.
           * 
           * @param { object } info - row of data to be processed by the formatter function,
           * providing the value and original tag for each row.
           * 
           * @returns { any } the original value of the cell specified in the `tag` variable,
           * or its formatted value as determined by the `formatter` parameter.
           */
          cell: (info) => {
            const tag = info.row.original;
            return column.formatter ? column.formatter(info.getValue(), tag) : info.getValue();
          },
        }),
      ),
    [columnsConfig, t],
  );

  return (
    <div className="col-span-12">
      {/**
       * @description Renders a table with specified columns, data, and options for pagination,
       * loading, and row linking.
       * 
       * @param { array } columns - fields to display for each tag listed on the page.
       * 
       * @param { object } data - array of tags to be displayed in the table.
       * 
       * @param { boolean } hasNextPage - boolean value of whether there are additional tag
       * objects available for display beyond those currently shown on the page.
       * 
       * @param { boolean } loading - whether or not there are more results to be retrieved
       * from the API, and is used to control the display of a "load more" button.
       * 
       * @param { integer } rowsPerPage - amount of tags to display per page in the Tag
       * Table component.
       * 
       * @param { string } title - title of the table display.
       * 
       * @param { number } pageIndex - 0-based index of the current page being displayed,
       * allowing for navigation between pages of data with `setPageIndex()`.
       * 
       * @param { number } setPageIndex - index of the current page being displayed among
       * the total number of pages available, allowing it to be updated accordingly.
       * 
       * @param { TagType } rowLink - link for each row displayed on the page, providing a
       * path to the tag's details when clicked.
       * 
       * 	* `tag`: The id of the tag linked to the row.
       * 	* `rowLink` itself is either a function or an undefiend value, depending on whether
       * it was provided as part of the input or not.
       */}
      <TanstackTable
        columns={columns}
        data={tags}
        hasNextPage={hasNextPage}
        loading={!tags?.length}
        rowsPerPage={pageSize}
        title={title}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        rowLink={rowLink ? (tag: TagType) => `/tag/${tag.id}` : undefined}
      />
    </div>
  );
};

export { Tags };
