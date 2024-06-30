import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Layout from "@app/layouts/default";
import Link from "next/link";

/**
 * @description Generates high-quality documentation for code given to it.
 * 
 * @returns { HTML `div` element } a layout component that displays a list of links
 * to create tag and tagging record pages.
 * 
 * 	* `const { t } = useTranslation("common");`: This line imports the `useTranslation`
 * hook from the `next/translations` package and uses it to fetch translations for
 * the "common" namespace. The translated text is stored in the `t` variable.
 * 	* `<Layout>` : This component represents the parent element of the content that
 * will be rendered inside it.
 * 	* `<div className="container mx-auto col-span-12">`: This is a div component that
 * wraps the content to be rendered within it. It has a container class and takes up
 * the full width of its parent element using the `mx-auto` property. The `col-span-12`
 * property specifies that the div should span all 12 columns in a responsive grid.
 * 	* `<ul className="list-disc pl-6">`: This is an unordered list component that
 * renders a list of items. It has a class of "list-disc" which means the list will
 * be displayed as a bullet point list, and the "pl-6" class specifies that the padding
 * between list items should be 6 pixels.
 * 	* `<li>`: This is an item in the list component. It is wrapped inside a link component.
 * 	* `<Link href="/playground/create-tag" className="link-primary">`: This is a Link
 * component that links to the URL "/playground/create-tag". The `className` attribute
 * specifies the class of the linked element, which in this case is "link-primary".
 * 	* `<Link href="/playground/create-tagging-record" className="link-primary">`:
 * This is another Link component that links to the URL "/playground/create-tagging-record".
 * The `className` attribute specifies the class of the linked element, which in this
 * case is also "link-primary".
 * 
 * 	In summary, the output returned by the `<anonymous>` function is a React component
 * that renders an unordered list of links to pages related to tag creation and tagging
 * records.
 */
const Playground: NextPage = () => {
  const { t } = useTranslation("common");

  return (
    <Layout>
      <div className="container mx-auto col-span-12">
        <ul className="list-disc pl-6">
          <li>
            <Link href="/playground/create-tag" className="link-primary">
              {t("create-tag")}
            </Link>
          </li>
          <li>
            <Link href="/playground/create-tagging-record" className="link-primary">
              {t("create-tagging-record")}
            </Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default Playground;
