import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { Truncate } from "@app/components/Truncate";

/**
 * @description Segments a URL path into its constituent parts, mapping each part to
 * a title component.
 * 
 * @param { ReturnType<typeof useRouter> } router - Routing component's `useRouter`
 * hook result, which provides the current URL path and query parameters.
 * 
 * @param { (key: string) => string } t - function to be applied on each segment of
 * the path, mapping the segment to an empty string if it is empty or contains only
 * square brackets, and returning the result of applying the function to the rest of
 * the segment.
 * 
 * @returns { string[] } an array of string segments that are extracted from the URL
 * path using a combination of regular expressions and callback functions.
 */
const getTitleSegments = (router: ReturnType<typeof useRouter>, t: (key: string) => string): string[] => {
  const pathSegments = router.pathname.split("/").slice(1);
  return pathSegments
    .map((segment) => {
      if (segment === "[...id]") return "";
      if (segment.startsWith("[") && segment.endsWith("]")) {
        const paramName = segment.slice(1, -1);
        const value = router.query[paramName];
        return value ? value.toString() : "";
      }
      return t(segment);
    })
    .filter(Boolean);
};

/**
 * @description Manipulates an array of strings (`segments`). It checks if the first
 * segment ends with "s" and removes it, then checks if the first segment is "Tag"
 * and removes the first element and truncates the rest. Finally, it truncates all
 * segments to a maximum length of 32 characters.
 * 
 * @param { string[] } segments - 1-dimensional array of substrings to be truncated.
 * 
 * @returns { string[] } an array of trimmed strings, with each segment limited to
 * 32 characters and a "middle" suffix added for tags.
 */
const adjustSegments = (segments: string[]): string[] => {
  if (segments.length > 1 && segments[0].endsWith("s")) {
    segments[0] = segments[0].slice(0, -1);
  }
  if (segments.length > 1 && segments[0] === "Tag") {
    // Remove the first segment and truncate the rest
    return segments.slice(1).map((segment, index) => `#${Truncate(segment, 32, "middle")}`);
  }
  return segments.map((segment) => Truncate(segment, 32, "middle")); // Ensure other segments are also truncated
};

/**
 * @description Uses router information and translations to determine the page title
 * based on the current URL
 * 
 * @returns { string } a shortened title for the current URL or a fallback string.
 */
export const pathToTitle = (): string => {
  const { t } = useTranslation("common");
  const router = useRouter();

  if (router.pathname === "/" || router.pathname.trim() === "") {
    return t("explorer");
  }

  let titleSegments = getTitleSegments(router, t);
  titleSegments = adjustSegments(titleSegments);

  const title = titleSegments.length > 1 ? titleSegments.join(": ") : titleSegments.join("");
  return title || t("explorer");
};
