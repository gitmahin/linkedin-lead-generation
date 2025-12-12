"use client";
import { leadContainerStore } from "@/services/store/searchPageStore";
import { LinkType } from "@/types/link";
import { socket } from "@/utils";
import { Button, Input, Spinner, Textarea } from "@repo/ui";
import { Send } from "lucide-react";
import { observer } from "mobx-react";
import { JSX, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { encode } from "@toon-format/toon";
import { mdxToHtml } from "@/utils/mdxToHtml";

type ChatMessage = {
  type: "user" | "ai";
  text: string;
};

export const ChatbotSidebar = observer(() => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [thinking, setThinking] = useState<boolean>(false);
  const [renderedMessages, setRenderedMessages] = useState<JSX.Element[]>([]);

  const handleGetResponse = () => {
    try {
      setThinking(true);
      if (!message.trim()) return toast.error("Empty message");
      setChat((prev) => [...prev, { type: "user", text: message }]);

      const toon = encode(leadContainerStore.leads, {
        indent: 2,
        delimiter: ",",
        keyFolding: "off",
        flattenDepth: Infinity,
      });

      console.log(`this is formatted ${toon}`);

      socket.emit(
        "chat_gen_ai",
        `Here is the data:\n${toon}\n\nUser message:\n${message ? message + "\n\n response format: mdx. dont use ```mdx```" : "give only links with name"}
         `
      );

      setMessage("");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    socket.on("gen_ai_response", (response: string) => {
      setChat((prev) => [...prev, { type: "ai", text: response }]);
      setThinking(false);
    });

    return () => {
      socket.off("gen_ai_response");
    };
  }, []);

  useEffect(() => {
    const renderMdx = async () => {
      const newMessages: JSX.Element[] = [];

      for (const msg of chat) {
        if (msg.type === "ai") {
          const MdxComponent = await mdxToHtml(msg.text);

          newMessages.push(
            <div key={Math.random()} className="space-y-1">
              <p className="font-semibold text-green-600">AI Response:</p>
              <div className="p-2 border rounded-md bg-background-900C">
                {MdxComponent}
              </div>
            </div>
          );
        } else {
          newMessages.push(
            <div
              key={Math.random()}
              className="p-2 border rounded-md bg-blue-500 text-white"
            >
              {msg.text}
            </div>
          );
        }
      }

      setRenderedMessages(newMessages);

         setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    };

    renderMdx();
  }, [chat]);
  return (
    <div className="sticky shrink-0 top-[55px] right-0 w-[500px] h-[calc(100vh-55px)] border-l flex flex-col ">
      <div className="flex-1 overflow-y-auto h-full p-3 space-y-3 pb-32">
        {renderedMessages}
        <div ref={chatEndRef}  />
      </div>
      <div className="absolute bottom-0 z-50 w-full p-3 flex justify-center items-center gap-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can i help you today!"
          className="resize-none h-auto! max-h-[150px] bg-background-900C! shadow-2xl"
        />
        <Button
          onClick={handleGetResponse}
          className="shrink-0 w-[35px] rounded-full flex justify-center items-center cursor-pointer"
        >
          {thinking ? <Spinner /> : <Send />}
        </Button>
      </div>
    </div>
  );
});
