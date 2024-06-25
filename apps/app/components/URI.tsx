import useTranslation from "next-translate/useTranslation";

/**
 * @description Opens a new web browser tab or window with the specified `uri` using
 * `window.open()` method, while also displaying a button with an SVG icon representing
 * the action.
 * 
 * @param { string } .value - uri that will be opened using the `window.open()` method
 * when the button is clicked.
 * 
 * @returns { <emphasis>DOMNode</emphasis } a button with an SVG icon and a text
 * label, opening the specified URL when clicked.
 * 
 * 	* `value`: The URL to open in a new tab using the `window.open()` method.
 * 	* `onClick`: The event handler that is triggered when the button is clicked. It
 * stops the propagation of the event and opens the specified URL using `window.open()`.
 */
const URI = ({ value }: { value: string }) => {
  const { t } = useTranslation("common");
  /**
   * @description Opens a specified URL using `window.open()` method, with noopener and
   * noreferrer parameters to prevent the default browser behavior and maintain the
   * security of the site.
   * 
   * @param { string } uri - URL to be opened in a new tab using the `window.open()` method.
   */
  const openURI = (uri: string) => {
    window.open(uri, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={(event) => {
        event.stopPropagation();
        openURI(value);
      }}
      className="link link-primary"
    >
      <svg className="inline-flex w-5 h-5" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17.25 15.25V6.75H8.75"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17 7L6.75 17.25"
        />
      </svg>
      <span className="sr-only">{t("open URI")}</span>
    </button>
  );
};

export { URI };
