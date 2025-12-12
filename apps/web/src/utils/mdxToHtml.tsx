import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

import rehypeSlug from "rehype-slug";
import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

import { CopyCodeButton } from "../components/code";


import { ExternalLink } from "lucide-react";

export type FileType =
  | "js"
  | "ts"
  | "tsx"
  | "jsx"
  | "html"
  | "css"
  | "json"
  | "bash"
  | "nginx"
  | "docker"
  | "git"
  | "cpp"
  | "c"
  | "md"
  | "mdx"
  | "text"
  | "npm"
  | "turbo"
  | "prettier";

type AnchorProps = ComponentPropsWithoutRef<"a">;
type PreTagProps = ComponentPropsWithoutRef<"pre">;

type CodeElementProps = {
  children?: React.ReactNode;
  className?: string;
  ["data-language"]?: string;
};

export const mdxToHtml = async (content: string) => {
  const { content: MdxComponent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark-high-contrast",
                light: "github-light-high-contrast",
              },
            },
          ],
        ],
      },
    },
    components: {
      a: ({ href, children, ...props }: AnchorProps) => {
        const className =
          "text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors";
        if (href?.startsWith("/")) {
          return (
            <Link href={href} className={className} {...props}>
              {children}
            </Link>
          );
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${className} inline-flex`}
            {...props}
          >
            {children}
             <ExternalLink size={14} className="pl-0.5" />
          </a>
        );
      },
      pre: ({ children, ...props }: PreTagProps) => {
        const codeElement = React.Children.only(
          children
        ) as React.ReactElement<CodeElementProps>;
        const language = codeElement?.props?.["data-language"] ?? "bash";
        return (
          <div className="border h-full w-full p-1 pt-0 rounded-[15px] bg-background-color_925C border-border-color_800C next-mdx-remote-codeblock">
            <div className="h-[35px] w-full flex justify-center items-center gap-3 px-2 py-0.5">
              <div className="w-full flex justify-start items-center gap-5">
                <div className="w-full flex justify-start items-center gap-1.5 ">
                  <span className="text-text-color_2 text-read_3 font-medium">
                    {language}
                  </span>
                </div>
              </div>
              <CopyCodeButton />
            </div>
            <pre
              {...props}
              className="my-0 p-2 overflow-x-auto rounded-[10px] max-w-full whitespace-pre shadow dark:bg-background-color_900C bg-background-color_950C border-border-color_800C border"
            >
              {children}
            </pre>
          </div>
        );
      },
    },
  });

  return MdxComponent;
};
