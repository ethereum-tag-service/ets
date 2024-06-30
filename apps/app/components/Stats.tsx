import { useStats } from "@app/hooks/useStats";
import useTranslation from "next-translate/useTranslation";

/**
 * @description Generates high-quality documentation for code provided, using the
 * `useStats` hook to fetch statistics and the `useTranslation` hook to handle
 * translations. It returns a section of documentation containing statistics on tagging
 * records, tags, relayers, and taggers.
 * 
 * @returns { :
 * 
 * div } a section of HTML containing four stat labels and their respective values,
 * each consisting of a title and value element.
 * 
 * 	* `stats`: This is an object that contains various statistics related to the
 * application's performance and usage.
 * 	* `t`: This is an object that contains translation strings in English.
 * 	* `taggingRecordsCount`: The number of tagging records stored in the application.
 * 	* `tagsCount`: The number of tags used in the application.
 * 	* `relayerCountActive`: The number of active relayers in the application.
 * 	* `taggerCount`: The number of users who have created tags in the application.
 * 
 * 	The output of the `Stats` function is a React component that displays different
 * statistics related to the application's performance and usage. Each statistic is
 * displayed as a separate section with a heading and a value.
 */
const Stats = () => {
  const { stats } = useStats({
    config: {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 1000,
    },
  });

  const { t } = useTranslation("common");

  return (
    <section className="stats stats-vertical col-span-12 w-full border shadow-sm xl:stats-horizontal">
      <a href="/tagging-records" className="hover:bg-base-200">
        <div className="stat">
          <div className="stat-title">{t("tagging-records")}</div>
          <div className="stat-value">{stats && stats.taggingRecordsCount ? stats.taggingRecordsCount : null}</div>
        </div>
      </a>
      <a href="/tags" className="hover:bg-base-200">
        <div className="stat">
          <div className="stat-title">{t("tags")}</div>
          <div className="stat-value">{stats && stats.tagsCount ? stats.tagsCount : null}</div>
        </div>
      </a>
      <a href="/relayers" className="hover:bg-base-200">
        <div className="stat">
          <div className="stat-title">{t("relayers")}</div>
          <div className="stat-value">{stats && stats.relayerCountActive ? stats.relayerCountActive : null}</div>
        </div>
      </a>
      <a href="/tagging-records" className="hover:bg-base-200">
        <div className="stat">
          <div className="stat-title">{t("taggers")}</div>
          <div className="stat-value">{stats && stats.taggerCount ? stats.taggerCount : null}</div>
        </div>
      </a>
    </section>
  );
};

export { Stats };
