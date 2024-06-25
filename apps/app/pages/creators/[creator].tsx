import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCreators } from "@app/hooks/useCreators";
import { useCtags } from "@app/hooks/useCtags";
import useTranslation from "next-translate/useTranslation";
import { timestampToString } from "@app/utils";
import { toEth } from "@app/utils";
import Layout from "@app/layouts/default";
import { TimeAgo } from "@app/components/TimeAgo";
import { Tags } from "@app/components/Tags";
import { Tag } from "@app/components/Tag";
import { Number } from "@app/components/Number";
import { CopyAndPaste } from "@app/components/CopyAndPaste";
import { Truncate } from "@app/components/Truncate";
import { Panel } from "@app/components/Panel";

/**
 * @description Generates high-quality documentation for code provided by an `useRouter`,
 * `useCreators`, and `usCtags` hooks. It displays creator information, tags created
 * and auction revenue, tagging records, and tagging revenue.
 * 
 * @returns { JSXElement` of type `React.Node } a React component that displays
 * information about the creator of a tag, including their ID, first seen timestamp,
 * and statistics on tags created and auction revenue.
 * 
 * 	1/ `const { query } = useRouter();`: This line imports the `query` object from
 * the `useRouter()` hook. The `query` object is an instance of `NavigatorQuery`,
 * which contains information about the current navigation state.
 * 	2/ `const { creator } = query;`: This line extracts the `creator` property from
 * the `query` object and assigns it to a new variable called `creator`.
 * 	3/ `const { t } = useTranslation("common");`: This line imports the `t` function
 * from the `useTranslation()` hook. The `t` function is used for internationalization
 * (i18n) of strings.
 * 	4/ `const { creators } = useCreators({ ... });`: This line imports the `creators`
 * property from the result of the `useCreators()` hook. The `creators` property is
 * an array of objects, each representing a creator in the system. Each object has
 * properties such as `id`, `firstSeen`, `tagsCreated`, and others.
 * 	5/ `<div className="grid gap-6 mx-auto mt-8 lg:mb-12 mb-6 lg:gap-12 md:space-y-0
 * md:grid sm:w-full md:grid-cols-2">`: This line creates a grid container with a
 * spacing of 6 pixels and a max-width of the full width of the screen for medium-up
 * displays.
 * 	6/ `<div className="grid content-start w-full gap-6 mx-auto lg:gap-12 text-sm">`:
 * This line creates a grid container within the previous one, with a spacing of 6
 * pixels and a max-width of the full width of the screen for medium-up displays.
 * 	7/ `creators && Truncate(creators[0].id, 13, "middle")`: This line extracts the
 * `id` property from the first object in the `creators` array and truncates it to a
 * maximum length of 13 characters in the middle using the `Truncate()` function.
 * 	8/ `Tags(tags, { title: "tags-created-by", field: "tagAppliedInTaggingRecord"
 * })`: This line renders a `<Tags>` component within the grid container, passing in
 * the `tags` property and customizing the label and field properties for the tag element.
 * 
 * 	In summary, the output returned by the `<anonymous>` function is a grid container
 * that displays information about a specific creator in the system, including their
 * ID, first seen timestamp, created tags, and tagging record information.
 */
const Creator: NextPage = () => {
  const { query } = useRouter();
  const { creator } = query;
  const { t } = useTranslation("common");
  const { creators } = useCreators({
    pageSize: 1,
    skip: 0,
    filter: { id: creator },
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  });

  const { tags = [] } = useCtags({
    filter: { creator_: { id: creator } },
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
        <div className="grid gap-6 mx-auto mt-8 lg:mb-12 mb-6 lg:gap-12 md:space-y-0 md:grid sm:w-full md:grid-cols-2">
          <div className="grid content-start w-full gap-6 mx-auto lg:gap-12 text-sm">
            <div>
              <Panel title={t("overview")}>
                <div className="grid grid-cols-2 px-6 py-4 space-x-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("id")}</div>
                  <div className="flex space-x-1 justify-end">
                    <div className="">{creators && Truncate(creators[0].id, 13, "middle")}</div>
                    <CopyAndPaste value={creators && creators[0].id} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("first-seen")}</div>
                  <div className="text-right">
                    <div className="">{creators && timestampToString(parseInt(creators[0].firstSeen))}</div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
          <div className="grid content-start w-full gap-6 mx-auto lg:gap-12 text-sm">
            <div>
              <Panel title={t("stats")}>
                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("tags-created")}</div>
                  <div className="text-right">
                    <div className="">{creators && <Number value={creators[0].tagsCreated} />}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("created-tags-in-tagging-record")}</div>
                  <div className="text-right">
                    <div className="">
                      {creators && <Number value={creators[0].createdTagsAddedToTaggingRecords} />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("created-tags-auction-revenue")}</div>
                  <div className="text-right">
                    <div className="">
                      {creators && toEth(creators[0].createdTagsAuctionRevenue, 4)}
                      &nbsp;{t("matic")}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("created-tags-tagging-revenue")}</div>
                  <div className="text-right">
                    <div className="">
                      {creators && toEth(creators[0].createdTagsTaggingFeeRevenue, 4)}
                      &nbsp;{t("matic")}
                    </div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </div>
        <div>
          {/**
           * @description Generates high-quality documentation for code based on information
           * provided to it, including tags and creator ID.
           * 
           * @param { string } title - tag created by the user.
           * 
           * @param { array } tags - tag names associated with the function.
           * 
           * @param { boolean } rowLink - 4th column of the table, which links to the original
           * record.
           * 
           * @param { object } columnsConfig - 3 columns that will be displayed in the table,
           * each with its own custom formatter function to render the content in a meaningful
           * way.
           */}
          <Tags
            title={t("tags-created-by", {
              creator: creators && Truncate(creators[0].id, 13, "middle"),
            })}
            tags={tags}
            rowLink={false}
            columnsConfig={[
              { title: "tag", field: "tag", formatter: (_: any, tag: any) => <Tag tag={tag} /> },
              {
                title: "created",
                field: "timestamp",
                formatter: (value: any, tag: any) => <TimeAgo date={value * 1000} />,
              },
              { title: "tagging records", field: "tagAppliedInTaggingRecord" },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Creator;
