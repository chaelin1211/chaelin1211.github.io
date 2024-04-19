"use client";
import { useSearchParams } from "next/navigation";
import { getPage } from "@/src/app/notion/notion-service";
import MarkdownComponent from "@/src/app/ui/share/markdown";
import { useEffect, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
export default function Page() {
  const searchParams = useSearchParams();
  const postId = (searchParams.get("postId") as string) || "";

  const [page, setPage] = useState<string>("");
  useEffect(() => {
    const fetchPost = async () => {
      const page = await getPage(postId);
      setPage(page);
    };
    hljs.initHighlighting.called = false;
    hljs.initHighlighting();
    fetchPost();
  }, [postId]);

  return <MarkdownComponent markdown={page} />;
}
