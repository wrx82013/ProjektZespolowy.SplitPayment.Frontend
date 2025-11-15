"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SplitLogo from "../../public/assets/splitpayLogo.png";
import { LogoWordmark } from "./LogoWordmark";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.2)]">
      <div className="mx-auto flex w-full items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        <a href="/calculator" className="flex-shrink-0">
          <div className="relative flex shrink-0 content-stretch items-center gap-2 sm:gap-4">
            <div className="relative h-[50px] w-[52px] sm:h-[79px] sm:w-[82px] shrink-0">
              <img
                alt="Splitpayhomie logo"
                className="block size-full object-contain"
                src={SplitLogo.src}
              />
            </div>
            <div className="hidden sm:block">
              <LogoWordmark />
            </div>
          </div>
        </a>
        <div className="hidden items-center gap-[35px] font-['Roboto_Flex:Regular',sans-serif] text-[28px] font-normal not-italic text-black text-nowrap md:flex">
          <Link
            href="/calculator"
            className={`relative shrink-0 transition-opacity hover:opacity-80 ${pathname === "/calculator" ? "underline decoration-solid [text-underline-position:from-font]" : ""}`}
          >
            Split new bill
          </Link>
          <Link
            href="/history"
            className={`relative shrink-0 transition-opacity hover:opacity-80 ${pathname === "/history" ? "underline decoration-solid [text-underline-position:from-font]" : ""}`}
          >
            History
          </Link>
          <Link
            href="/settings"
            className={`relative shrink-0 transition-opacity hover:opacity-80 ${pathname === "/settings" ? "underline decoration-solid [text-underline-position:from-font]" : ""}`}
          >
            Settings
          </Link>
        </div>
        <div className="md:hidden flex-shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="size-6 sm:size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="bg-custom-green p-4 md:hidden border-t border-gray-200">
          <div className="flex flex-col items-center gap-4 font-['Roboto_Flex:Regular',sans-serif] text-lg font-normal text-black">
            <Link
              href="/calculator"
              className={`relative shrink-0 transition-opacity hover:opacity-80 ${pathname === "/calculator" ? "underline decoration-solid [text-underline-position:from-font]" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Split new bill
            </Link>
            <Link
              href="/history"
              className={`relative shrink-0 transition-opacity hover:opacity-80 ${pathname === "/history" ? "underline decoration-solid [text-underline-position:from-font]" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              History
            </Link>
            <Link
              href="/settings"
              className={`relative shrink-0 transition-opacity hover:opacity-80 ${pathname === "/settings" ? "underline decoration-solid [text-underline-position:from-font]" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
