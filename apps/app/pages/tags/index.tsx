import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useCtags } from "@app/hooks/useCtags";
import Layout from "@app/layouts/default";
import { Truncate } from "@app/components/Truncate";
import { TimeAgo } from "@app/components/TimeAgo";
import { Tag } from "@app/components/Tag";
import { useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { TanstackTable } from "@app/components/TanstackTable";
import { globalSettings } from "@app/config/globalSettings";
import { TagType } from "@app/types/tag";

/**
 * @description Generates high-quality documentation for code given, utilizing state
 * and memoized values to create a `TanstackTable` component with columns for tag
 * name, creation timestamp, owner ID, relayer ID, and the number of tagging records.
 * 
 * @returns { HTMLDivElement } a React component that renders a table with columns
 * and data fetched from an API.
 * 
 * 	* `columnHelper`: A column helper instance created using the `createColumnHelper`
 * function from the `react-table` library. It has an accessor function for each
 * column, which defines the rendering of the column's cell.
 * 	* `tags`: An array of objects representing tags. Each tag object has properties
 * `tag`, `timestamp`, `ownerId`, `relayerId`, and `tagAppliedInTaggingRecord`.
 * 	* `pageIndex`: A state variable used to keep track of the current page number
 * being displayed. It is initialized to 0 and updated by the `setPageIndex` function.
 * 	* `nextTags`: An array of tags that are available but not currently displayed on
 * the page. It is only present when there are more tags than can fit on the current
 * page.
 * 	* `globalSettings`: An object containing default page size settings for the application.
 * 	* `loading`: A boolean indicating whether there are still tags to load or not.
 * It is set to `true` when there are no tags left to load and `false` otherwise.
 */
const Ctags: NextPage = () => {
  const { t } = useTranslation("common");
  const [pageIndex, setPageIndex] = useState(0);
  const { tags = [], nextTags } = useCtags({
    skip: pageIndex * 20,
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 1500,
    },
  });

  const columnHelper = createColumnHelper<TagType>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("display", {
        header: () => "Tag",
        cell: (info) => <Tag tag={info.row.original} />,
      }),
      columnHelper.accessor("timestamp", {
        header: () => "Created",
        cell: (info) => <TimeAgo date={info.getValue() * 1000} />,
      }),
      columnHelper.accessor("owner.id", {
        header: () => t("owner"),
        cell: (info) => Truncate(info.getValue(), 13, "middle"),
      }),
      columnHelper.accessor("relayer.id", {
        header: () => t("relayer"),
        cell: (info) => Truncate(info.getValue(), 13, "middle"),
      }),
      columnHelper.accessor("tagAppliedInTaggingRecord", {
        header: () => "Tagging Records",
      }),
    ],
    [columnHelper, t],
  );

  return (
    <Layout>
      <div className="col-span-12">
        <TanstackTable
          columns={columns}
          data={tags}
          hasNextPage={!!nextTags?.length}
          loading={!tags?.length}
          rowsPerPage={globalSettings["DEFAULT_PAGESIZE"]}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      </div>
    </Layout>
  );
};

export default Ctags;
