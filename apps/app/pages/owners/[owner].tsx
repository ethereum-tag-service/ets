import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useOwners } from "@app/hooks/useOwners";
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
 * @description Fetches owner tags from Matic using `useOwners` and `usCags`, displays
 * the owner information, and renders a Tags component to display owner tags.
 * 
 * @returns { number } a layout with a grid container that displays various owner information.
 */
const Owner: NextPage = () => {
  const { query } = useRouter();
  const { owner } = query;
  const { t } = useTranslation("common");
  const filter = {
    owner_: { id: owner },
  };
  const { owners } = useOwners({
    pageSize: 1,
    skip: 0,
    filter: { id: owner },
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
    filter: { owner_: { id: owner } },
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
                <div className="grid grid-cols-2 px-6 py-4 space-x-4 md:grid-flow-col hover:bg-slate-100 ">
                  <div className="font-semibold">{t("id")}</div>
                  <div className="flex space-x-1 justify-end">
                    <div className="">{owners && Truncate(owners[0].id)}</div>
                    <CopyAndPaste value={owners && owners[0].id} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("first-seen")}</div>
                  <div className="text-right">
                    <div className="">{owners && timestampToString(parseInt(owners[0].firstSeen))}</div>
                  </div>
                </div>
              </Panel>
            </div>
          </div>
          <div className="grid content-start w-full gap-6 mx-auto lg:gap-12 text-sm">
            <div>
              <Panel title={t("stats")}>
                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("tags-owned", { timeframe: t("current") })}</div>
                  <div className="text-right">
                    <div className="">{owners && <Number value={owners[0].tagsOwned} />}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("tags-owned", { timeframe: t("lifetime") })}</div>
                  <div className="text-right">
                    <div className="">{owners && <Number value={owners[0].tagsOwnedLifeTime} />}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("owned-tags-in-tagging-records")}</div>
                  <div className="text-right">
                    <div className="">{owners && <Number value={owners[0].ownedTagsAddedToTaggingRecords} />}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-4 md:grid-flow-col hover:bg-slate-100">
                  <div className="font-semibold">{t("tagging-revenue")}</div>
                  <div className="text-right">
                    <div className="">
                      {owners && toEth(owners[0].ownedTagsTaggingFeeRevenue, 4)}
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
           * @description Generates high-quality documentation for given code, using the provided
           * tags to create an informative and organized documentation page.
           * 
           * @param { string } title - tag owner(s) and displays their name with an optional
           * middle part when exceeding a fixed length, as indicated by the `middle` argument.
           * 
           * @param { array } tags - tag associated with the code snippet.
           * 
           * @param { boolean } rowLink - whether or not the row should have a link for navigating
           * to a related record within the application, and it defaults to `false`.
           * 
           * @param { object } columnsConfig - 3 columns displayed for the list of owners,
           * including one with the owner's ID truncated to 13 characters in the middle and
           * accompanied by a tag icon, as well as two other columns showing the creation
           * timestamp and a count of tagging records.
           */}
          <Tags
            title={t("owner-tags") + " " + (owners && Truncate(owners[0].id, 13, "middle"))}
            tags={tags}
            rowLink={false}
            columnsConfig={[
              { title: "tag", field: "tag", formatter: (_: any, tag: any) => <Tag tag={tag} /> },
              {
                title: "created",
                field: "timestamp",
                formatter: (value: any, _: any) => <TimeAgo date={value * 1000} />,
              },
              { title: "tagging records", field: "tagAppliedInTaggingRecord" },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Owner;
