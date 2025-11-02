"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SplitLogo from "../../public/assets/splitpayLogo.png";
import { LogoWordmark } from "./LogoWordmark";

export default function Navbar() {
  const pathname = usePathname();
  console.log("SplitLogo", SplitLogo.src);

  return (
    <div
      className="box-border flex w-full content-stretch items-center justify-between overflow-clip bg-white px-[24px] py-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.2)]"
      data-name="Navbar"
    >
      <a href="/calculator">
        <div className="relative flex shrink-0 content-stretch items-center gap-4">
          <div className="relative h-[79px] w-[82px] shrink-0">
            <img
              alt="Splitpayhomie logo"
              className="block size-full max-w-none"
              height="79"
              src={SplitLogo.src}
              width="82"
            />
          </div>
          <LogoWordmark />
        </div>
      </a>
      <div className="relative flex shrink-0 content-stretch items-center gap-[35px] font-['Roboto_Flex:Regular',sans-serif] text-[28px] leading-[normal] font-normal text-nowrap whitespace-pre text-black not-italic">
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
    </div>
  );
}
