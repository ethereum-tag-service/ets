import type { NextPage } from "next";
import Layout from "@app/layouts/default";
import { TaggingRecords } from "@app/components/TaggingRecords";

/**
 * @description Renders an HTML layout component containing a `Tagging Records` component.
 * 
 * @returns { Layout } a component instance of `TaggingRecords`.
 * 
 * 	* `Layout`: The output is an HTML layout component that contains a `TaggingRecords`
 * component.
 * 	* `TaggingRecords`: A component that displays tagging records.
 */
const RecentlyTagged: NextPage = () => {
  return (
    <Layout>
      <TaggingRecords />
    </Layout>
  );
};

export default RecentlyTagged;
