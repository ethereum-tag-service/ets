import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import { useCtags } from "@app/hooks/useCtags";
import Layout from "@app/layouts/default";
import { Truncate } from "@app/components/Truncate";
import { TimeAgo } from "@app/components/TimeAgo";
import { Tags } from "@app/components/Tags";
import { Tag } from "@app/components/Tag";
import { useState } from "react";

/**
 * @description Generates high-quality documentation for code given to it, based on
 * information provided to it. It utilizes various hooks and utilities such as
 * `useTranslation()`, `useState()`, `useCtags()` to provide a flexible and efficient
 * approach to documenting code.
 * 
 * @returns { object } a React component that renders a `Tags` component with custom
 * formatting for tag titles and creation dates.
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

  return (
    <Layout>
      <div className="col-span-12">
        {/**
         * @description Displays information for each tag in the list of tags passed as an
         * argument, including the tag's name and timestamp when it was created, the owner
         * and relayer IDs, and a count of the number of tagging records for that tag.
         * 
         * @param { array } tags - tag objects to generate documentation for.
         * 
         * @param { boolean } rowLink - 13th column of the table, which links to the related
         * record in the tagging records section when clicked.
         * 
         * @param { number } pageIndex - 0-based index of the current page being displayed
         * in the paginated documentation, allowing for efficient jumping to specific pages
         * within the provided dataset.
         * 
         * @param { number } setPageIndex - 13th function argument, which, when provided,
         * updates the internal state of the component to reflect that a new page has been accessed.
         * 
         * @param { boolean } hasNextPage - existence of more pages of tag records beyond the
         * current page, and it is used to determine whether to display a "next" button or not.
         * 
         * @param { object } columnsConfig - 6 columns that will be displayed in the grid,
         * each column defined by its own configuration object that includes title, field,
         * formatter, and custom styling options for each column.
         */}
        <Tags
          tags={tags}
          rowLink={false}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          hasNextPage={!!nextTags?.length}
          columnsConfig={[
            { title: "tag", field: "tag", formatter: (_: any, tag: any) => <Tag tag={tag} /> },
            {
              title: "created",
              field: "timestamp",
              formatter: (value: any, tag: any) => <TimeAgo date={value * 1000} />,
            },
            {
              title: t("owner"),
              field: "owner.id",
              formatter: (value: any, tag: any) => Truncate(value, 13, "middle"),
            },
            {
              title: t("relayer"),
              field: "relayer.id",
              formatter: (value: any, tag: any) => Truncate(value, 13, "middle"),
            },
            { title: "tagging records", field: "tagAppliedInTaggingRecord" },
          ]}
        />
      </div>
    </Layout>
  );
};

export default Ctags;
