"use client";
import { sidebarStore } from "@/services/store/searchPageStore";
import { LinkType } from "@/types/link";
import { Button } from "@repo/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SIDEBAR_HEADER_LINKS: LinkType[] = [
  {
    label: "Leads",
    slug: "leads",
  },
  {
    label: "People",
    slug: "people",
  },
];
export const SearchPageHeader = () => {
  const path_name = usePathname();

  useEffect(() => {
    const last_path = path_name.split("/").pop();

    if (last_path) sidebarStore.setLocation(last_path);
  }, [path_name]);
  return (
    <div>
      <div className="flex justify-start items-center gap-2 px-3">
        {SIDEBAR_HEADER_LINKS.map((item, i) => {
          return (
            <Link href={`/search/${item.slug}`} key={`${item.slug}-${i}`}>
              <Button
                size={"sm"}
                className="cursor-pointer"
                variant={`${path_name.endsWith(`${item.slug}`) ? "default" : "secondary"}`}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
