"use client";
import React, { useEffect, useState } from "react";
import { getPostList } from "@/src/app/notion/notion-service";
import { PostSimple } from "@/src/app/notion/notion-result";
import PostInfo from "@/src/app/[category]/post-info";

const PostList: React.FC<{ category: string }> = ({ category }) => {
  const [postList, setPostList] = useState<PostSimple[]>([]);
  useEffect(() => {
    const fetchPostList = async () => {
      const postList = await getPostList(category);
      setPostList(postList);
    };
    fetchPostList();
  }, [category]);

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
      {postList.map((item) => (
        <PostInfo key={item.id} currentPost={item} />
      ))}
    </div>
  );
};

export default PostList;
