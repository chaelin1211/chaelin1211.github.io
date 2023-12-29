import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";

interface MarkdownComponentProps {
  markdown: string;
}

const MarkdownComponent: React.FC<MarkdownComponentProps> = ({ markdown }) => {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkParse, remarkStringify]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownComponent;
