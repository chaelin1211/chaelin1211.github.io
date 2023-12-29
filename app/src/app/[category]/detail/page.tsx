"use client";
import { useSearchParams } from "next/navigation";
import { getPage } from "@/src/app/notion/notion-service";
import MarkdownComponent from "@/src/app/markdown";
import { useEffect, useState } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const postId = (searchParams.get("postId") as string) || "";

  const [page, setPage] = useState<string>("");
  useEffect(() => {
    const fetchPostList = async () => {
      const page = await getPage(postId);
      setPage(page);
    };
    fetchPostList();
  }, [postId]);

  return <MarkdownComponent markdown={page} />;
}
