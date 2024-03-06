import Link from "next/link";
import { cn } from "@/lib/utils";
import * as React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 px-6 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">로아검문소</span>
          </Link>
          {/*<nav className="flex gap-6">*/}
          {/*  <Link*/}
          {/*    href={"/"}*/}
          {/*    className={cn(*/}
          {/*      "flex items-center text-sm font-medium text-muted-foreground",*/}
          {/*      // item.disabled && "cursor-not-allowed opacity-80",*/}
          {/*    )}*/}
          {/*  >*/}
          {/*    군장검사*/}
          {/*  </Link>*/}
          {/*  <Link*/}
          {/*    href={"/jobsearch"}*/}
          {/*    className={cn(*/}
          {/*      "flex items-center text-sm font-medium text-muted-foreground",*/}
          {/*      // item.disabled && "cursor-not-allowed opacity-80",*/}
          {/*    )}*/}
          {/*  >*/}
          {/*    구인구직*/}
          {/*  </Link>*/}
          {/*</nav>*/}
        </div>
      </div>
    </header>
  );
}
