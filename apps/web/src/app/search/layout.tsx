import React from "react";
import { SearchPageSidebar } from "./components";
import { LayoutPropsType } from "@/types";

export default function Layout({ children }: LayoutPropsType) {
  return (
    <div className="w-full grid grid-cols-[300px_1fr] relative h-screen overflow-y-auto">
      <SearchPageSidebar />

      <div className="w-full">{children}</div>
    </div>
  );
}
