import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@repo/ui";

type MainWrapper = {
  children: React.ReactNode;
};

export function MainWrapper({ children }: MainWrapper) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="m-0! rounded-none!">
        {/* <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header> */}
        <div className="h-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
