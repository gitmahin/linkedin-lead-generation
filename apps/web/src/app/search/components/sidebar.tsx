"use client"
import { Button } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";


type LinkType = {
    label: string;
    slug: string
}

const SIDEBAR_HEADER_LINKS: LinkType[] = [
    {
        label: "Leads",
        slug: "leads"
    },
    {
        label: "People",
        slug: "people"
    },

]

export const SearchPageSidebar = () => {
  const path_name = usePathname()

  return (
    <aside className="w-full h-screen p-2 sticky top-0">
      <div className="w-full h-full rounded-2xl bg-background-925C">
        <div className="border-b h-[50px] w-full border-brdcolor-800C flex justify-start items-center px-2 gap-2">
            {
                SIDEBAR_HEADER_LINKS.map((item, i) => {
                    return <Link href={`/search/${item.slug}`} key={`${item.slug}-${i}`}>
                            <Button size={"sm"} variant={`${path_name.endsWith(`${item.slug}`) ? "default": "secondary"}`}>
                                {item.label}
                            </Button>
                    </Link>
                })
            }
        </div>
      </div>
    </aside>
  );
};
