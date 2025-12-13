"use client";
import { sidebarStore } from "@/services/store/searchPageStore";
import {
  Button,
  Input,
  Label,
  Spinner,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  cn,
} from "@repo/ui";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  leadContainerStore,
  LinkedinLeadsType,
} from "@/services/store/searchPageStore/leadContainerStore";
import { Check, ChevronsUpDown } from "lucide-react";
import { socket } from "@/utils";

type FormValues = {
  job_title: string;
  location: string;
  industry: string;
  number_of_pages: number;
};
const SCRAPPING_APPS = [
  {
    value: "linkedin",
    label: "Linkedin",
  },
  {
    value: "twitter",
    label: "Twitter",
  },
  {
    value: "Reddit",
    label: "reddit",
  },
];

const ScrappingAppSelector = () => {
    const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(SCRAPPING_APPS[0]?.value);
  return <div>
          <Label className="mb-2">Using</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                disabled
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className=" justify-between w-full"
              >
                {value
                  ? SCRAPPING_APPS.find(
                      (framework) => framework.value === value
                    )?.label
                  : SCRAPPING_APPS[0]?.label}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {SCRAPPING_APPS.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={
                          framework.value
                            ? framework.value
                            : SCRAPPING_APPS[0]?.value
                        }
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        {framework.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === framework.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
}

const LeadFields = observer(() => {

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // const handleGetData = async () => {
  //   // google search
  //   // const g_data = await fetch(
  //   //   "https://www.googleapis.com/customsearch/v1?key=AIzaSyBwta2CawrUbd88Yqfresk1-kxnhwrJesU&cx=c425ced687cdd4142&q=Softawre"
  //   // );

  //   // uipile search
  //   const url = "https://api20.unipile.com:15029/api/v1/linkedin/search?account_id=yPF77nLQTamn56S5xObxNw";

  //   const options = {
  //     method: "POST",
  //     headers: {
  //       accept: "application/json",
  //       'X-API-KEY': '',
  //       'content-type': 'application/json',
  //     },
  //     body: JSON.stringify({ api: "classic", category: "people" }),
  //   };
  //   const unipile_data = await fetch(url, options);

  //   // apify
  //   // const input = {
  //   //   KEYWORD: "developer",
  //   //   DOMAIN_EMAIL: ["@gmail.com"],
  //   //   LOCATION: "",
  //   //   MAX_ITEMS: 20,
  //   // };

  //   // const run = await apifyClient.actor("TzkiiGkKUFoXta1dq").call(input);
  //   // const { items } = await apifyClient
  //   //   .dataset(run.defaultDatasetId)
  //   //   .listItems();
  //   // console.dir(items);

  //   console.log(await unipile_data.json())
  // };
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const handleGetDataSocket = async (data: FormValues) => {
    socket.emit("extract_link", data);
    leadContainerStore.setLoading(true);
  };

  useEffect(() => {
    let toastId: string | number | null = null;
    let pageToastId: string | number | null = null;
    let remaining = 0;
    let totalResults = 0;

    socket.on(
      "extracting_page",
      (payload: { currentPage: number; totalPages: number }) => {
        const { currentPage, totalPages } = payload;
        setPageNumber(currentPage);
        setTotalPages(totalPages);

        if (!toastId) {
          toastId = toast.loading("Preparing for extraction...");
        }

        if (!pageToastId) {
          // Show first toast
          pageToastId = toast.loading(
            `Scraping page ${currentPage} of ${totalPages}…`
          );
        } else {
          // Update existing toast
          toast.dismiss(pageToastId);
          pageToastId = toast.loading(
            `Scraping page ${currentPage} of ${totalPages}…`
          );
        }
      }
    );

    socket.on("size_of_result", (size: number) => {
      remaining += size;
      totalResults = size;

      if (!toastId) {
        // First toast
        toastId = toast.loading(`Extracting ${remaining} leads…`);
      }
    });

    socket.on("lead", (lead: LinkedinLeadsType) => {
      leadContainerStore.setLoading(true);
      leadContainerStore.setLeads(lead);

      if (remaining > 0) remaining -= 1;
      // update toast by dismissing and creating new one
      if (toastId !== null) {
        toast.dismiss(toastId);
        toastId = toast.loading(
          `Remaining ${remaining} out of ${totalResults} leads…`
        );
      }
    });

    socket.on("done", () => {
      if (toastId !== null) {
        toast.dismiss(toastId);
        toast.success(
          `Extraction completed with ${leadContainerStore.leads.length} leads successfully!`
        );
      }
      if (pageToastId !== null) toast.dismiss(pageToastId);
      leadContainerStore.setLoading(false);
      toastId = null;
      pageToastId = null;
      remaining = 0;
      reset();
    });

    socket.on("scrape_error", () => {
      if (toastId !== null) {
        toast.dismiss(toastId);
        toast.error("Scrapping Interrupt!");
      }
    });

    socket.on("linkedin_search_page_not_found", () => {
      if (toastId !== null) toast.dismiss(toastId);
      if (pageToastId !== null) toast.dismiss(pageToastId);
      leadContainerStore.setLoading(false);
      toast.error("Search Page Not Found!");
      toast.success("Exiting Scraper as successful scrapping");
      toastId = null;
      pageToastId = null;
    });

    socket.on("ln_scrap_connection_lost", () => {
      if (toastId !== null) toast.dismiss(toastId);
      if (pageToastId !== null) toast.dismiss(pageToastId);
      leadContainerStore.setLoading(false);
      toast.error("Connection Lost! Could Not Complete Extraction.");
      toastId = null;
      pageToastId = null;
    });

    return () => {
      socket.off("size_of_result");
      socket.off("lead");
      socket.off("done");
      socket.off("scrape_error");
      socket.off("linkedin_search_page_not_found");
      socket.off("extracting_page");
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(handleGetDataSocket)}>
      <div className="space-y-4">
        <ScrappingAppSelector/>
        {leadContainerStore.leads.length > 0 && (
          <div className="text-right my-10">
            <Label className="text-[16px] text-foreground-2">
              Total Extracted
            </Label>
            <Label className="text-2xl">
              {leadContainerStore.leads.length}
            </Label>
          </div>
        )}
        <div>
          <Label>Job Title</Label>
          <Input {...register("job_title")} className="mt-2" />
        </div>
        <div>
          <Label>Location</Label>
          <Input {...register("location")} disabled className="mt-2" />
        </div>
        <div>
          <Label>Industry</Label>
          <Input {...register("industry")} disabled className="mt-2" />
        </div>

        <div>
          <Label>Number of Pages To Extract</Label>
          <Input
            {...register("number_of_pages")}
            className="mt-2"
            type="number"
            defaultValue={1}
          />
        </div>

        {leadContainerStore.loading ? (
          <Button
            type="button"
            className="w-[calc(100%-25px)] absolute bottom-3 cursor-pointer"
          >
            <Spinner /> Extracting Leads | Page: {pageNumber}
          </Button>
        ) : (
          <Button
            disabled={leadContainerStore.loading}
            type="submit"
            className="w-[calc(100%-25px)] absolute bottom-3 cursor-pointer"
          >
            Extract Leads
          </Button>
        )}
      </div>
    </form>
  );
});


const AdvancedLeadFields = observer(() => {
  return <div>
    <form action="">
          <div className="space-y-4">

            <div>
              <Label></Label>
              <Input type="text" className="mt-2" />
            </div>


 <div>
              <Label></Label>
              <Input type="text" className="mt-2" />
            </div>

             <div>
              <Label></Label>
              <Input type="text" className="mt-2" />
            </div>

          </div>


    </form>
  </div>
})

const SearchPageSidebarContentWrapper = observer(() => {
  return (
    <>
      {sidebarStore.location === "basic-leads" ? (
        <LeadFields />
      ) : sidebarStore.location === "advanced-leads" ? (
        <AdvancedLeadFields/>
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
