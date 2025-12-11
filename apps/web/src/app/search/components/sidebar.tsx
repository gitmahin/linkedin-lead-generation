"use client";
import { sidebarStore } from "@/services/store/searchPageStore";
import { Button, Input, Label } from "@repo/ui";
import React from "react";
import { observer } from "mobx-react";
import { getLinkedinLead } from "@/actions/server.action";
import { apifyClient } from "@/lib";

const LeadFields = () => {
  const handleGetData = async () => {
    // google search
    // const g_data = await fetch(
    //   "https://www.googleapis.com/customsearch/v1?key=AIzaSyBwta2CawrUbd88Yqfresk1-kxnhwrJesU&cx=c425ced687cdd4142&q=Softawre"
    // );

    // uipile search
    const url = "https://api20.unipile.com:15029/api/v1/linkedin/search?account_id=yPF77nLQTamn56S5xObxNw";

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        'X-API-KEY': 'zUR7+TTU.R/aLoy+OiXVdZM+4nk/EQs2sJySI8FW+SQ/+TeDWEtc=',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ api: "classic", category: "people" }),
    };
    const unipile_data = await fetch(url, options);

    // apify
    // const input = {
    //   KEYWORD: "developer",
    //   DOMAIN_EMAIL: ["@gmail.com"],
    //   LOCATION: "",
    //   MAX_ITEMS: 20,
    // };

    // const run = await apifyClient.actor("TzkiiGkKUFoXta1dq").call(input);
    // const { items } = await apifyClient
    //   .dataset(run.defaultDatasetId)
    //   .listItems();
    // console.dir(items);

    console.log(await unipile_data.json())
  };
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

      <Button
        onClick={handleGetData}
        className="w-[calc(100%-25px)] absolute bottom-3 cursor-pointer"
      >
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
