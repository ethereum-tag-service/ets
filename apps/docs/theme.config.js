// theme.config.js
const Logo = ({ height }) => (
  <svg height={height} viewBox="0 0 100 100" fill="none">
    <path fill="currentColor" d="M0 50 50 0H0v50zm100 50V50l-50 50h50zM50 0l50 50V0H50zM19.9 84.9c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.3 5 5z"/>
  </svg>
);

export default {
  projectLink: 'https://github.com/ethereum-tag-service/ets', // GitHub link in the navbar
  docsRepositoryBase: 'https://github.com/ethereum-tag-service/ets/blob/stage', // base URL for the docs repository
  titleSuffix: ' – ETS',
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  floatTOC: true,
  footerText: `© ${new Date().getFullYear()} ETS`,
  footerEditLink: `Edit this page on GitHub`,
  logo: () => {
    return (
      <>
        <Logo height={25} />
        <span
          className="mx-2 text-2xl font-bold hidden md:inline select-none"
          title={"ETS"}
        >
          ETS
        </span>
      </>
    );
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="ETS: Ethereum Tag Service" />
      <meta name="og:title" content="ETS: Ethereum Tag Service" />
    </>
  ),
}