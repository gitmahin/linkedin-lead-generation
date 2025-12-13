"use client";
import { leadContainerStore } from "@/services/store/searchPageStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ItemMedia,
  ItemContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  ItemActions,
  ItemTitle,
  Item,
  Skeleton,
} from "@repo/ui";
import { ChevronRightIcon } from "lucide-react";
import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";

const LeadContainer = observer(() => {
  return (
    <>
      <div className="space-y-2 overflow-y-auto h-[calc(100vh-55px)] w-full py-2 shrink-0">
        {leadContainerStore.leads.map((item, i) => {
          return (
            <>
              {item &&
                Object.values(item).every(
                  (v) => v !== null && v !== undefined
                ) && (
                  <Card key={i}>
                    <CardHeader className="flex justify-start items-start gap-3">
                      <Avatar>
                        <AvatarImage
                          className="w-[50px]! h-[50px]! object-cover"
                          src={`${item.image ? item.image : ""}`}
                          alt={`${item.name}`}
                        />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <CardTitle>{item.name}</CardTitle>
                        <p className="mt-2 text-foreground-4 text-[14px]">
                          {item.description}
                        </p>
                        <p className=" text-foreground-2 text-[14px]">
                          {item.location}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {item.contact.map((cnt, i) => {
                        return (
                          <Item
                            key={i}
                            variant="outline"
                            size="sm"
                            asChild
                            className="group"
                          >
                            <Link href={`${cnt.href}`}>
                              <ItemContent>
                                <p className="text-[12px] text-foreground-2 font-medium mb-0">
                                  {cnt.link_type
                                    ? cnt.link_type.charAt(0).toUpperCase() +
                                      cnt.link_type.slice(1)
                                    : ""}
                                </p>
                                <ItemTitle className="group-hover:underline">
                                  {cnt.text}{" "}
                                </ItemTitle>
                                
                              </ItemContent>
                              <ItemActions>
                                <ChevronRightIcon className="size-4" />
                              </ItemActions>
                            </Link>
                          </Item>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
            </>
          );
        })}
      </div>
    </>
  );
});

export default function LeadPage() {
  return <LeadContainer />;
}
