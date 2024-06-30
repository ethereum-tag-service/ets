import React from "react";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { Auction } from "@app/types/auction";
import { timestampToString } from "@app/utils";
import { Truncate } from "@app/components/Truncate";
import { AuctionIcon, Trophy } from "@app/components/icons";

interface Props {
  auction: Auction;
}

/**
 * @description Returns an HTML component displaying information about an auction,
 * including whether it has ended and the identity of the winner, based on props
 * provided by parent component.
 * 
 * @param { object } .auction - auction data object passed from parent component,
 * which contains information about the auction, including its end time and winner.
 * 
 * @returns { HTML division element } an HTML element containing information about
 * the auction's status and winner.
 * 
 * 	* `const { t } = useTranslation("common");`: This line imports the `useTranslation`
 * hook from the `react-i18next` library and assigns it to a variable called `t`. The
 * `useTranslation` hook is used to fetch translations from the i18n store.
 * 	* `<div>...</div>`: This element represents the main content container for the
 * auction details.
 * 	* `{auction.ended && auction.settled}`: This line checks if both `auction.ended`
 * and `auction.settled` are truthy values. If they are, the contents inside the curly
 * braces are displayed.
 * 	* `<AuctionIcon size={24} />`: This element displays an icon representing an
 * auction. The `size` prop is used to set the icon's size to 24.
 * 	* `<span>{t("AUCTION.ENDED")}</span>`: This element displays a string value
 * translated from the i18n store using the `t` function. The key for this translation
 * is "AUCTION.ENDED".
 * 	* `<span className="font-semibold">{timestampToString(auction.endTime)}</span>`:
 * This element displays the time since the auction ended in a font style called
 * "font-semibold". The `timestampToString` function is used to format the `auction.endTime`
 * value as a human-readable string.
 * 	* `<div className="flex items-center space-x-1">...</div>`: This element represents
 * another container for additional auction details.
 * 	* `<Trophy size={24} />`: This element displays an icon representing a trophy.
 * The `size` prop is used to set the icon's size to 24.
 * 	* `<span>{t("AUCTION.WINNER")}</span>`: This element displays a string value
 * translated from the i18n store using the `t` function. The key for this translation
 * is "AUCTION.WINNER".
 * 	* `<Link href={`/owners/${auction.bidder.id}`} legacyBehavior>`: This element
 * displays a link to the owner's profile page. The `href` prop is set to the path
 * `/owners/${auction.bidder.id}`, and the `legacyBehavior` prop is used to enable
 * legacy behavior for the link.
 * 	* `<a className="link link-primary font-semibold">{Truncate(auction.bidder.id,
 * 14, "middle")}</a>`: This element displays a hyperlink to the owner's profile page.
 * The `className` prop is set to "link", and the `link-primary` class is added for
 * styling. The `font-semibold` class is added to the text content of the link to
 * display it in a semibold font style. The `Truncate` function is used to truncate
 * the `auction.bidder.id` value to 14 characters, and the `"middle"` argument is
 * used to specify that the truncation should occur at the middle of the string.
 */
const AuctionSummary: React.FC<Props> = ({ auction }) => {
  const { t } = useTranslation("common");
  return (
    <div>
      {auction.ended && auction.settled && (
        <div>
          <div className="flex items-center space-x-1">
            <AuctionIcon size={24} />
            <span>{t("AUCTION.ENDED")}</span>
            <span className="font-semibold">{timestampToString(auction.endTime)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy size={24} />
            <span>{t("AUCTION.WINNER")}</span>
            <Link href={`/owners/${auction.bidder.id}`} legacyBehavior>
              <a className="link link-primary font-semibold">{Truncate(auction.bidder.id, 14, "middle")}</a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionSummary;
