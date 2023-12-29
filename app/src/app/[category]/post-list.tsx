"use client";
import React, { useEffect, useState } from "react";
import { getPostList } from "@/src/app/notion/notion-service";
import { PostSimple } from "@/src/app/notion/notion-result";
import Link from "next/link";

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
    <ul>
      {postList.map((item, index) => (
        <li key={index}>
          <Link
            href={{
              pathname: `/${category}/detail`,
              query: { postId: item.id },
            }}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default PostList;
