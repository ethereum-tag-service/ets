import React, { ReactNode } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Button } from "@app/components/Button";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { globalSettings } from "@app/config/globalSettings";
import { useModal } from "@app/hooks/useModalContext";

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
 * @description Generates high-quality documentation for given code, using React Table
 * library and the provided columns, data, loading, rowsPerPage, title, rowLink,
 * hasNextPage, and pageIndex props.
 * 
 * @param { TableProps<TData> } .columns - array of column metadata that defines the
 * structure of the table, including the headers and the data to be displayed.
 * 
 * @param { TableProps<TData> } .data - 2D array containing the data to be displayed
 * in the table.
 * 
 * @param { TableProps<TData> } .loading - loading state of the table, and when it
 * is true, it will render a placeholder row with a "pulsing" background to indicate
 * that data is still being loaded.
 * 
 * @param { TableProps<TData> } .rowsPerPage - default number of rows to display per
 * page when manually paginating data, and it is used internally by `useReactTable`
 * to calculate the current page and limit the amount of data displayed.
 * 
 * @param { TableProps<TData> } .title - table title that is displayed above the
 * table, and its value is used to render the corresponding h2 heading in the UI.
 * 
 * @param { TableProps<TData> } .rowLink - `RowLink` component that will be displayed
 * as an icon next to each row, allowing the user to navigate to the corresponding
 * record when clicked.
 * 
 * @param { TableProps<TData> } .hasNextPage - flag whether there is another page of
 * data available or not.
 * 
 * @param { TableProps<TData> } .pageIndex - 0-based index of the current page being
 * displayed in the table, which is used to calculate the page size and to control
 * the navigation between pages.
 * 
 * @param { TableProps<TData> } .setPageIndex - 0-based index of the current page
 * being displayed and allows the functionality to update the page number when the
 * user navigates forward or backward through the data using the "prev" and "next" buttons.
 * 
 * @returns { object } a React component rendering a table with pagination buttons.
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
  const { isModalOpen } = useModal();

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
   * @description Increments the page index by one and assigns the updated value to the
   * `pageIndex` variable.
   */
  const nextPage = () => {
    setPageIndex?.(pageIndex + 1);
  };

  /**
   * @description Decrements the `pageIndex` variable by 1.
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
           * @description Generates high-quality documentation for given code.
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
           * @description Generates a table body component with rows and cells, based on the
           * provided configuration and data. It returns a JSX element containing the table structure.
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
                    className={rowLink && !isModalOpen ? "hover:bg-base-200 cursor-pointer" : ""}
                    onClick={() => rowLink && !isModalOpen && router.push(String(rowLink(row.original)))}
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
