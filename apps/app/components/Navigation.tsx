import { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";

import { AuctionIcon } from "./icons/AuctionIcon";
import { Globe } from "./icons/Globe";
import { Playground } from "./icons/Playground";

/**
 * @description Generates a navbar component with links to various sections of the application.
 * 
 * @returns { HTML element } a HTML element containing a navbar with Ethereum Tag
 * Service links.
 * 
 * 	* `<nav>` is an HTML element that represents a navigation bar. It has a class of
 * "flex" and a min-height of "screen".
 * 	* `<div>` within the nav bar has a class of "mr-0 ml-4 items-center flex gap-2
 * overflow-y-auto bg-base-100 px-6 py-10". This element contains other navigation elements.
 * 	* `<Link>` elements within the div are used to create links for different parts
 * of the platform. Each Link element has a href attribute that specifies the URL of
 * the link, and a className attribute that specifies the styles to apply to the link.
 * The classes applied to these elements include "text-slate-800", "hidden", "md:block",
 * "flex", "items-center", and "-mr-1.5".
 * 	* `<h1>` within the Link element is a heading element with a class of "sr-only".
 * This element has a role of "presentation" and provides additional context to
 * assistive technologies.
 * 	* `ul` element within the nav bar contains a list of platform features, represented
 * by `<li>` elements. Each `<li>` element contains a Link element that creates a
 * link for a specific feature. The classes applied to these links include "menu",
 * "font-normal", "text-gray-400", and "-mr-1.5".
 * 	* The output of the `Navigation` function is a HTML structure that represents a
 * navigation bar for a platform, with links to various parts of the platform.
 */
export default function Navigation() {
  const { t } = useTranslation("common");
  const router = useRouter();

  /**
   * @description Determines whether a path matches a given base path by splitting the
   * current router path and comparing the second segment with the provided base path.
   * If they are equal, the path is active.
   * 
   * @param { string } basePath - second segment of the current URL path, which is
   * compared to the first segment of the pathname passed to the function to determine
   * if they match.
   * 
   * @returns { boolean } a boolean value indicating whether the current path matches
   * the given base path.
   */
  const isActive = (basePath: string): boolean => {
    const firstSegment = router.pathname.split("/")[1];
    return firstSegment === basePath;
  };
  return (
    <>
      <nav className="flex min-h-screen w-80 flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10">
        <div className="mr-0 ml-4 items-center font-black mb-4">
          <Link href="/" passHref>
            <div className="relative flex items-center">
              <svg
                className="h-8 text-slate-800 hidden md:block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
              >
                <path
                  fill="currentColor"
                  d="M0 50 50 0H0v50zm100 50V50l-50 50h50zM50 0l50 50V0H50zM19.9 84.9c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.3 5 5z"
                />
              </svg>
              <span className="hidden md:inline-flex ml-2.5 text-xl font-medium text-slate-900 tracking-tight">
                Ethereum Tag Service
              </span>
              <h1 className="sr-only">Ethereum Tag Service</h1>
            </div>
          </Link>
        </div>
        <ul className="menu font-normal text-gray-400">
          <li>
            <Link className={isActive("") ? "text-gray-950 bg-gray-100" : ""} href="/">
              <span className="-mr-1.5">
                <Globe size={24} />
              </span>
              {t("explorer")}
            </Link>
            <ul>
              <li>
                <Link className={isActive("tagging-records") ? "text-gray-950 bg-gray-50" : ""} href="/tagging-records">
                  {t("tagging-records")}
                </Link>
              </li>
              <li>
                <Link className={isActive("tags") ? "text-gray-950 bg-gray-50" : ""} href="/tags">
                  {t("tags")}
                </Link>
              </li>
              <li>
                <Link className={isActive("targets") ? "text-gray-950 bg-gray-50" : ""} href="/targets">
                  {t("targets")}
                </Link>
              </li>
              <li>
                <Link className={isActive("relayers") ? "text-gray-950 bg-gray-50" : ""} href="/relayers">
                  {t("relayers")}
                </Link>
              </li>
              <li>
                <Link className={isActive("taggers") ? "text-gray-950 bg-gray-50" : ""} href="/taggers">
                  {t("taggers")}
                </Link>
              </li>
              <li>
                <Link className={isActive("creators") ? "text-gray-950 bg-gray-50" : ""} href="/creators">
                  {t("tag-creators")}
                </Link>
              </li>
              <li>
                <Link className={isActive("owners") ? "text-gray-950 bg-gray-50" : ""} href="/owners">
                  {t("tag-owners")}
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link className={isActive("auction") ? "text-gray-950 bg-gray-50" : ""} href="/auction">
              <span className="-mr-1.5">
                <AuctionIcon size={24} />
              </span>
              {t("auction")}
            </Link>
          </li>

          <li>
            <Link className={isActive("playground") ? "text-gray-950 bg-gray-50" : ""} href="/playground">
              <span className="-mr-1.5">
                <Playground size={24} />
              </span>
              {t("playground")}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
