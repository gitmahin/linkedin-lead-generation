"use client";
import { LinkType } from "@/types/link";
import { Button, Input, Textarea } from "@repo/ui";
import { Send } from "lucide-react";
import { useRef } from "react";
export const ChatbotSidebar = () => {
  return (
    <div className="sticky shrink-0 top-[55px] right-0 w-[500px] h-[calc(100vh-55px)] border-l">
      <div className="absolute bottom-0 w-full p-3 flex justify-center items-center gap-3">
        <Textarea
          placeholder="How can i help you today!"
          className="resize-none h-auto! max-h-[150px]"
        />
        <Button className="shrink-0 w-[35px] rounded-full flex justify-center items-center cursor-pointer">
          <Send />
        </Button>
      </div>
    </div>
  );
};
