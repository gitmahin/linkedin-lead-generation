import React from "react";
import { SearchPageHeader, SearchPageSidebar } from "./components";
import { LayoutPropsType } from "@/types";
import { LinkType } from "@/types/link";


export default function Layout({ children }: LayoutPropsType) {
  return (
    <div className="w-full relative h-screen overflow-y-auto">
      <div className="w-full bg-background-950C border-b border-brdcolor-800C h-[55px] flex justify-start items-center sticky top-0 z-10">
        <SearchPageHeader/>
      </div>

      <div className="grid grid-cols-[300px_1fr] ">
        <div className="h-[calc(100vh-55px)] ">
          <SearchPageSidebar />
        </div>

        <div className="w-full pt-2">{children}</div>
      </div>
    </div>
  );
}
