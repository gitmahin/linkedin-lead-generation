import { RefreshCcwIcon, Search } from "lucide-react";
import { CalendarIcon } from "lucide-react";

import {
  Empty,
  Button,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
} from "@repo/ui";

export function EmptySearchMainPage() {
  return (
    <Empty className="from-zinc-900 to-zinc-950 h-full bg-gradient-to-b from-30% rounded-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>Try Searching</EmptyTitle>
        <EmptyDescription>
          Your Search Results will apppear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Card className=" w-80">
          <CardContent>
            <div className="flex justify-between gap-4">
              <Avatar>
                <AvatarImage src="/images/lead_img.png" className="filter invert" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-start">
                <h4 className="text-sm font-semibold">Lead</h4>
                <p className="text-sm text-foreground-2">
                  Find high-quality leads based on job title and professional role, helping you reach the right decision-makers effortlessly.
                </p>
              
              </div>
            </div>
          </CardContent>

        </Card>
      </EmptyContent>
    </Empty>
  );
}
