"use client";
import React, { useEffect, useState } from "react";
import { getPostList } from "@/src/app/notion/notion-service";
import { PostSimple } from "@/src/app/notion/notion-result";

const PostList: React.FC<{ category: string }> = async ({ category }) => {
  const [postList, setPostList] = useState<PostSimple[]>([]);
  useEffect(() => {
    const fetchPostList = async () => {
      const postList = await getPostList(category);
      setPostList(postList);
    };
    fetchPostList();
  }, [category]);

  return (
    <ul>
      {postList.map((item, index) => (
        <li key={index}>{item.title}</li>
      ))}
    </ul>
  );
};

export default PostList;
