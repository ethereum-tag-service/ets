import React, { useState, ReactNode, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Button } from "@app/components/Button";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { globalSettings } from "@app/config/globalSettings";

interface TableProps<TData> {
  columns: any[];
  data: TData[];
  loading: boolean;
  rowsPerPage?: number;
  title?: ReactNode;
  rowLink?: (data: TData) => string | undefined;
  hasNextPage?: boolean;
  pageIndex?: number;
  setPageIndex?: (pageIndex: number) => void;
}

/**
 * @description Generates high-quality documentation for code given to it, by using
 * ReactTable library and utilizing props provided by user. It creates a table based
 * on given columns and data, implements manual pagination, and provides navigation
 * buttons for next and previous pages.
 * 
 * @param { TableProps<TData> } .columns - 2D array of columns that define the layout
 * of the table, including their names, widths, and other properties.
 * 
 * @param { TableProps<TData> } .data - data to be displayed in the table.
 * 
 * @param { TableProps<TData> } .loading - row model is being generated through loading
 * data and will display an animation pulse loader to indicate that the data is still
 * being loaded.
 * 
 * @param { TableProps<TData> } .rowsPerPage - number of rows to display per page in
 * the table, which affects how much data is shown on each page and influences
 * pagination behavior.
 * 
 * @param { TableProps<TData> } .title - header title of the table, and is displayed
 * at the top of the table.
 * 
 * @param { TableProps<TData> } .rowLink - Row Link prop, which when present, allows
 * the user to navigate to the row by clicking on it.
 * 
 * @param { TableProps<TData> } .hasNextPage - availability of next page link, which
 * determines whether the `nextPage()` function is called when clicked or not.
 * 
 * @param { TableProps<TData> } .pageIndex - 0-based index of the currently displayed
 * page in the table, and is used to control the display of navigation buttons for
 * the previous and next pages.
 * 
 * @param { TableProps<TData> } .setPageIndex - page index that is to be updated and
 * controls whether the prev or next button should be enabled.
 * 
 * @returns { HTMLDivElement } a table component with pagination buttons and loading
 * indicator.
 * 
 * 	* `table`: This is a `ReactTable` component, which is used to render the table content.
 * 	* `loading`: This is a boolean property that indicates whether the data is still
 * loading or not. It is set to `true` when the data is still being fetched, and
 * `false` otherwise.
 * 	* `rowsPerPage`: This is the default number of rows to display per page. It is
 * set to `globalSettings["DEFAULT_PAGESIZE"]` if it is not provided as a prop.
 * 	* `title`: This is a string property that represents the title of the table. It
 * is only present if it was provided in the `TableProps` object.
 * 	* `rowLink`: This is a function that allows the user to navigate to a specific
 * row when clicked. If it is not provided as a prop, then it is set to `() => {}`.
 * 	* `hasNextPage`: This is a boolean property that indicates whether there are more
 * pages of data available. It is set to `true` if there are more pages, and `false`
 * otherwise.
 * 	* `pageIndex`: This is an integer property that represents the current page number.
 * It is only present if it was provided as a prop.
 * 	* `setPageIndex`: This is a function that allows the user to set the page index
 * programmatically. If it is not provided as a prop, then it is set to `() => {}`.
 */
const TanstackTable = <TData extends object>({
  columns,
  data,
  loading,
  rowsPerPage = globalSettings["DEFAULT_PAGESIZE"],
  title,
  rowLink,
  hasNextPage,
  pageIndex = 0,
  setPageIndex,
}: TableProps<TData>) => {
  const { t } = useTranslation("common");

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: {
        pageIndex,
        pageSize: rowsPerPage,
      },
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const router = useRouter();

  /**
   * @description Updates the `pageIndex` variable by incrementing it by 1 whenever it
   * is called.
   */
  const nextPage = () => {
    setPageIndex?.(pageIndex + 1);
  };

  /**
   * @description Reduces the page index by 1.
   */
  const prevPage = () => {
    setPageIndex?.(pageIndex - 1);
  };

  return (
    <div className="col-span-12">
      {title && <h2 className="text-2xl font-bold pb-4">{title}</h2>}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="table bg-white">
          {/**
           * @description Generates a table header row based on the provided header groups and
           * headers. It returns an array of `<th>` elements with each element containing a
           * header cell rendition.
           */}
          <thead>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <tr key={`header-group-${headerGroup.id}-${index}`}>
                {headerGroup.headers.map((header, index) => (
                  <th key={`header-${header.id}-${index}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {/**
           * @description Generates a tbody element based on the provided loading state and
           * table configuration. It returns an array of tr elements, each containing td elements
           * representing the cells in the table.
           */}
          <tbody>
            {loading
              ? [...Array(rowsPerPage)].map((_, rowIndex) => (
                  <tr key={`loading-row-${rowIndex}`}>
                    {[...Array(columns.length)].map((_, colIndex) => (
                      <td key={`loading-cell-${rowIndex}-${colIndex}`}>
                        <div className="w-full h-6 rounded bg-gray-200 animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={`table-row-${row.id}-${rowIndex}`}
                    className={`hover:bg-base-200 ${rowLink ? "cursor-pointer" : "cursor-auto"}`}
                    onClick={() => rowLink && router.push(String(rowLink(row.original)))}
                    style={{ cursor: rowLink ? "pointer" : "default" }}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <td key={`table-cell-${cell.id}-${cellIndex}`}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {setPageIndex && (
        <div className="flex justify-between mt-2 py-2">
          <Button className="btn-sm" disabled={pageIndex === 0} onClick={prevPage}>
            {t("prev")}
          </Button>
          <Button className="btn-sm" disabled={!hasNextPage} onClick={nextPage}>
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
};

export { TanstackTable };
