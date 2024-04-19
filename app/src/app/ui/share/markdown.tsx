import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";

interface MarkdownComponentProps {
  markdown: string;
}

const MarkdownComponent: React.FC<MarkdownComponentProps> = ({ markdown }) => {
  return (
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkParse, remarkStringify]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownComponent;
