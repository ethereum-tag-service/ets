import React from "react";

/**
 * @description Creates a SVG rectangle with two circular handles, using dynamic
 * calculations for viewBox dimensions and path d values based on a given size.
 * 
 * @param { number } .size - dimensions of the SVG viewBox and affects the calculation
 * of the aspect ratio and dimension of the inner paths.
 * 
 * @returns { SVG element } an SVG element containing multiple paths.
 * 
 * 	* The `<svg>` element has a width of `size` and a height of `size`, indicating
 * the size of the output diagram.
 * 	* The `viewBox` attribute of the `<svg>` element has a value of `0 0 24 ${24 /
 * aspectRatio}`, which defines the viewport dimensions for the diagram. This means
 * that the diagram will be displayed within a box that is centered on the origin
 * (x=0, y=0) and has a width and height of `size` and `size / aspectRatio`, respectively.
 * 	* The `path` elements within the `<svg>` element have various d attributes that
 * define their shapes. These shapes include circles, ellipses, and lines, which are
 * drawn within the viewport defined by the `viewBox` attribute.
 * 	* The `stroke` attribute of each `path` element specifies the color of the stroke,
 * while the `strokeWidth` attribute specifies the thickness of the stroke. The
 * `strokeLinecap` and `strokeLinejoin` attributes control the shape of the stroke
 * at the points where it intersects with other elements or the boundaries of the diagram.
 * 	* The `fill` attribute of the `<svg>` element is set to `"none"`, which means
 * that the background of the diagram will not be filled.
 */
export function Playground({ size = 24 }) {
  // Calculate aspect ratio based on the desired size
  const aspectRatio = 24 / size;

  // Calculate viewBox dimensions dynamically
  const viewBoxDimensions = `0 0 24 ${24 / aspectRatio}`;

  return (
    <svg width={size} height={size} viewBox={viewBoxDimensions} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.89062 9.28125L4.87279 17.7937C4.44606 18.628 5.29889 19.5379 6.16008 19.1671L14.6016 16.1875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M13.3196 10.9774C14.9594 12.8695 15.698 15.085 14.9691 15.9259C14.2403 16.7669 12.3202 15.9147 10.6804 14.0226C9.04057 12.1305 8.30205 9.91499 9.03085 9.07406C9.75966 8.23313 11.6798 9.08527 13.3196 10.9774Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M9.49994 17.6367C8.90314 17.2553 8.27339 16.707 7.68032 16.0227C7.28976 15.5721 6.95033 15.1031 6.66968 14.6387"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M11.5 5C11.5 5.27614 11.2761 5.5 11 5.5C10.7239 5.5 10.5 5.27614 10.5 5C10.5 4.72386 10.7239 4.5 11 4.5C11.2761 4.5 11.5 4.72386 11.5 5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M15.75 9.25L15.8787 9.12132C17.0503 7.94975 17.0503 6.05025 15.8787 4.87868L15.75 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
      <path
        d="M17 13.0001L17.2929 12.7072C17.6834 12.3167 18.3166 12.3167 18.7071 12.7072L19 13.0001"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>
    </svg>
  );
}
