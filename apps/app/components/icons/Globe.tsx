import React from "react";

/**
 * @description Generates a SVG path for an Earth map, based on the input size
 * parameter, calculated aspect ratio, and dynamically generated viewBox dimensions.
 * 
 * @param { number } .size - 2D size of the globe, which is used to calculate the
 * aspect ratio and viewBox dimensions of the SVG elements created by the function.
 * 
 * @returns { SVG element, specifically an <SVG viewBox dimensions="[size, size, 24,
 * 24]" > element with a filled path consisting of two parts: one representing Earth's
 * surface and the other representing the atmosphere around it } a SVG element
 * containing two paths, one for the Earth and another for the flag.
 * 
 * 	* The SVG element is created with a width and height equal to the `size` parameter
 * passed to the function.
 * 	* The viewBox dimensions are calculated based on the `size` and `aspectRatio`
 * variables declared within the function. These dimensions are defined in the
 * `viewBoxDimensions` string.
 * 	* Two SVG paths are created within the `svg` element. The first path has a stroke
 * color set to "currentColor", a line cap set to "round", a line join set to "round",
 * and a stroke width of 1.5. Its d attribute defines a shape that includes two arcs:
 * one centered at (12,4.75) with a radius of 0.75 and another centered at (19.25,12)
 * with a radius of 3.25.
 * 	* The second path has a fill color set to "currentColor", and its d attribute
 * defines a shape that includes two lines: one horizontal from (17.677,16.617) to
 * (17.677,4.75), and another vertical from (12,3.163) to (19.25,3.163).
 * 	* Both paths are contained within the `svg` element.
 * 
 * 	Overall, the output of the `Globe` function is an SVG image that depicts a stylized
 * representation of the Earth, with the blue and white path representing the surface
 * of the planet and the curved line at the bottom representing the horizon.
 */
export function Globe({ size = 24 }) {
  // Calculate aspect ratio based on the desired size
  const aspectRatio = 24 / size;

  // Calculate viewBox dimensions dynamically
  const viewBoxDimensions = `0 0 24 ${24 / aspectRatio}`;

  return (
    <svg width={size} height={size} viewBox={viewBoxDimensions} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 4.75a7.25 7.25 0 0 0 0 14.5c-1.243 0-3.25-2.75-3.25-7.25M12 4.75A7.25 7.25 0 0 1 19.25 12M12 4.75c-1.243 0-3.25 2.75-3.25 7.25M12 4.75c.953 0 2.357 1.619 2.959 4.404l.025.121M8.75 12H5m3.75 0h2.5"
      ></path>
      <path
        fill="currentColor"
        d="M17.677 16.617a.75.75 0 0 0-1.06 1.06l1.06-1.06Zm1.043 3.163a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-3.485-1.31a3.235 3.235 0 0 0 3.236-3.235h-1.5c0 .959-.777 1.736-1.736 1.736v1.5Zm0-4.97c.959 0 1.736.777 1.736 1.735h1.5A3.235 3.235 0 0 0 15.235 12v1.5Zm0-1.5A3.235 3.235 0 0 0 12 15.235h1.5c0-.958.777-1.735 1.735-1.735V12Zm0 4.97a1.735 1.735 0 0 1-1.735-1.735H12a3.235 3.235 0 0 0 3.235 3.236v-1.5Zm1.382.707 2.103 2.103 1.06-1.06-2.103-2.103-1.06 1.06Z"
      ></path>
    </svg>
  );
}
