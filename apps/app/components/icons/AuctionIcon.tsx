import React from "react";

/**
 * @description Calculates the dimensions of an SVG icon based on a provided size,
 * and returns an SVG element representing the icon with a dynamic viewBox dimension.
 * 
 * @param { number } .size - width of the SVG element, and it is used to calculate
 * the viewBox dimensions dynamically.
 * 
 * @returns { SVG element } an SVG icon of a bid button with different strokes for
 * the outline, inner shape, and shadow.
 * 
 * 	* `<svg>` element: The root element of the SVG graphics, which defines the overall
 * layout and dimensions of the icon.
 * 	* `width` and `height`: The width and height attributes of the `<svg>` element,
 * which specify the size of the icon in pixels.
 * 	* `viewBox` attribute: The viewBox attribute of the `<svg>` element, which specifies
 * the dimensions of the view box for the icon. In this case, the view box dimensions
 * are calculated dynamically based on the `size` parameter passed to the function.
 * 	* Four path elements: Four `<path>` elements within the `<svg>` element, each
 * defining a different part of the icon. The path data is given as strings inside
 * the `d` attribute of each `<path>` element.
 * 		+ First path: A curve representing the outline of the auction icon.
 * 		+ Second path: A curve representing the outline of the "Auction" text within the
 * icon.
 * 		+ Third path: A curve representing the outline of the right triangle in the icon.
 * 		+ Fourth path: A curve representing the outline of the left triangle in the icon.
 * 	* `stroke` and `strokeWidth`: The stroke attribute and stroke width attribute of
 * each `<path>` element, which specify the color and thickness of the line used to
 * draw the paths. In this case, the stroke is set to "currentColor" to inherit the
 * system-defined color.
 * 	* `strokeLinecap` and `strokeLinejoin`: The stroke linecap and stroke linejoin
 * attributes of each `<path>` element, which specify the way the lines are rounded
 * at their intersections with other paths or with the boundary of the icon. In this
 * case, they are set to "round" for a smooth, rounded appearance.
 * 	* Four corner points: The four corners of the auction icon are defined by the
 * four path elements, each of which has a specific x and y coordinate within the
 * `<svg>` element's bounds. These corner points are used to position the text and
 * other graphical elements within the icon.
 */
export function AuctionIcon({ size = 24 }) {
  // Calculate aspect ratio based on the desired size
  const aspectRatio = 24 / size;

  // Calculate viewBox dimensions dynamically
  const viewBoxDimensions = `0 0 24 ${24 / aspectRatio}`;

  return (
    <svg width={size} height={size} viewBox={viewBoxDimensions} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 14.25L5.75 10L7 8.75L7.5 9.25L10 6.75L9.5 6.25L11 4.75L15.25 9L14 10.25L13.5 9.75L10.75 12.5L11.25 13L10 14.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M12 12L19.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M4.75 18.75V19.25H13.25V18.75C13.25 17.6454 12.3546 16.75 11.25 16.75H6.75C5.64543 16.75 4.75 17.6454 4.75 18.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path d="M9 8L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}
