import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

/**
 * @description Generates breadcrumb labels based on router props and translation
 * data. It sets label only when not on home page, replaces dashes with spaces, handles
 * tag breadcrumb, and returns a breadcrumb element.
 * 
 * @param { any } props - passed title, which is used to construct the breadcrumb label.
 * 
 * @returns { HTML span element } a React component that displays a breadcrumb label
 * based on the current router path.
 * 
 * 	* `null`: This represents the absence of any content, indicating that the
 * `BreadcrumbItem` is not present or has no content to display.
 * 	* `dividerIcon`: This is an SVG icon representing a horizontal dividing line. It
 * is passed as a props object and used to render a breadcrumb separator when the
 * `label` is empty or null.
 * 	* `label`: This represents the text content of the breadcrumb item, which can be
 * either a string or a translation key. When the `label` is a translation key, it
 * will be replaced with the translated text using the `useTranslation` hook.
 * 	* `className`: This is a string that represents the class name of the breadcrumb
 * element. It can be used to customize the appearance of the breadcrumb item.
 * 
 * 	In summary, the `BreadcrumbItem` function returns an SVG icon and text content
 * for each breadcrumb item in the navigation path, with customizable classes for
 * styling purposes.
 */
const BreadcrumbItem = (props: any) => {
  let label;
  const router = useRouter();
  const { t } = useTranslation("common");

  const dividerIcon = (
    <svg className="flex-shrink-0 h-5 w-5 text-base mr-2" fill="none" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.75 8.75L14.25 12L10.75 15.25"
      ></path>
    </svg>
  );

  // Sets label only when we are not on home page.
  // effectively removes breadcrumb on homepage.

  if (router.asPath != "/") {
    // Replace dash with space.
    label = props.title.replace(/-/g, " ");

    // Handle tag breadcrumb
    let path = router.asPath.substring(1).split("/");
    if (path.length == 2 && path[0] == "tags") {
      if (label == path[1]) {
        label = "#" + label;
      }
    }

    if (label == "tags") {
      label = t("tags");
    }
  }

  return (
    <>
      {!label ? null : (
        <span className="flex">
          {label == t("explorer") ? null : dividerIcon}
          {label}
        </span>
      )}
    </>
  );
};

export { BreadcrumbItem };
