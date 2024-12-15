import { ConnectButtonETS } from "@app/components/ConnectButtonETS";
import { pathToTitle } from "@app/utils/titleUtils";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "./search/Search";

export default function Header() {
  const title = `${pathToTitle()} | Ethereum Tag Service`;
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="col-span-12 flex items-center justify-between lg:gap-4 pr-4 pt-2 lg:pr-0 lg:pt-0">
        {/* Left aligned elements */}
        <div className="flex items-center gap-2">
          <label htmlFor="main-drawer" className="btn btn-square btn-ghost drawer-button lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
              aria-labelledby="menuIconTitle"
            >
              <title id="menuIconTitle">Open main menu</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16" />
            </svg>
          </label>
          <Link href="/" passHref className="lg:hidden">
            <div className="relative flex items-center">
              <span className="text-xl font-bold text-slate-900">ETS</span>
              <h1 className="sr-only tracking-tighter">Ethereum Tag Service</h1>
            </div>
          </Link>
        </div>

        {/* Center aligned element */}
        <div className="flex-grow justify-center hidden lg:flex">
          <div className="bg-slate-100 hover:border-slate-400 input w-full max-w-xs flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
            <Search />
          </div>
        </div>

        {/* Right aligned elements */}
        <div className="flex-shrink-0">
          <ConnectButtonETS className="btn-primary btn-outline btn-sm" compact={isCompact} showChainSwitcher={true} />
        </div>
      </header>
    </>
  );
}
