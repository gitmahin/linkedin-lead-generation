"use client";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

export const CopyCodeButton = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Find the closest <pre> element
    console.log("copied the code");

    const wrapper = e.currentTarget.closest("div[class*='border']");
    const pre = wrapper?.querySelector("pre");
    const code = pre?.innerText;
    console.log("code tag", code);

    if (!code) return;
    console.log("copied the code success");

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 relative z-[2] rounded-tiny transition-colors flex-shrink-0 hover:bg-background-color_800C"
    >
      {copied ? (
        <Check size={16} className="dark:text-emerald-500 text-emerald-600" />
      ) : (
        <Copy size={16} className="text-text-svg_default_color" />
      )}
    </button>
  );
};
