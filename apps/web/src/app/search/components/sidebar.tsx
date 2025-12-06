"use client";
import { sidebarStore } from "@/services/store/searchPageStore";
import { Button, Input, Label } from "@repo/ui";
import React from "react";
import { observer } from "mobx-react";

const LeadFields = () => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Job Title</Label>
        <Input type="text" name="job_title" className="mt-2" />
      </div>
      <div>
        <Label>Location</Label>
        <Input type="text" name="location" className="mt-2" />
      </div>

      <div>
        <Label>Industry</Label>
        <Input type="text" name="industry" className="mt-2" />
      </div>

      <Button className="w-[calc(100%-25px)] absolute bottom-3 cursor-pointer">
        Extract Leads
      </Button>
    </div>
  );
};

const SearchPageSidebarContentWrapper = observer(() => {
  return (
    <>
      {sidebarStore.location === "leads" ? (
        <LeadFields />
      ) : sidebarStore.location === "people" ? (
        "people sidebar"
      ) : (
        "Undefined"
      )}
    </>
  );
});

export const SearchPageSidebar = observer(() => {
  return (
    <>
      {sidebarStore.location ? (
        <aside className="w-full h-full p-2 ">
          <div className="w-full h-full rounded-2xl bg-background-925C relative p-3">
        
              <SearchPageSidebarContentWrapper />
         
          </div>
        </aside>
      ) : (
        <></>
      )}
    </>
  );
});
