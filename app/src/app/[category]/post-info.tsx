"use client";
import React from "react";
import { PostSimple } from "@/src/app/notion/notion-result";
import Link from "next/link";

const PostInfo: React.FC<{ currentPost: PostSimple }> = ({ currentPost }) => {
  return (
    <>
      <article className="flex max-w-xl flex-col items-start justify-between">
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={currentPost.date.start} className="text-gray-500">
            {currentPost.date.start}
          </time>
          <Link
            href="#"
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            {currentPost.category.name}
          </Link>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <Link
              href={{
                pathname: `/detail`,
                query: { postId: currentPost.id },
              }}
            >
              <span className="absolute inset-0"></span>
              {currentPost.title}
            </Link>
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
            {currentPost["sub-title"]}
          </p>
        </div>
        <div className="flex gap-y-1 gap-x-1 flex-wrap mt-4 items-center gap-x-4 text-xs">
          {currentPost.tags.map((item) => (
            <Link
              key={item.id}
              href="#"
              className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="relative mt-8 flex items-center gap-x-4">
          {/*<img*/}
          {/*  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"*/}
          {/*  alt=""*/}
          {/*  className="h-10 w-10 rounded-full bg-gray-50"*/}
          {/*/>*/}
          {/*<div className="text-sm leading-6">*/}
          {/*  <p className="font-semibold text-gray-900">*/}
          {/*    <a href="#">*/}
          {/*      <span className="absolute inset-0"></span>*/}
          {/*      Michael Foster*/}
          {/*    </a>*/}
          {/*  </p>*/}
          {/*  <p className="text-gray-600">Co-Founder / CTO</p>*/}
          {/*</div>*/}
        </div>
      </article>
    </>
  );
};

export default PostInfo;
