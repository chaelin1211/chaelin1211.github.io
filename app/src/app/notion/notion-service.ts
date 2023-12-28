import {
  NotionDatabaseProperty,
  NotionPropertiesResult,
  notionPropsResultParse,
  PostSimple,
} from "./notion-result";
import CmmFetch from "@/src/app/CmmFetch";
import { NotionClient } from "@/src/app/notion/notion";

require("dotenv").config();

export async function getPostList(
  category: string = "",
  tags: string[] = [],
): Promise<PostSimple[]> {
  const params = new URLSearchParams();
  tags.forEach((tag) => {
    params.append("tags", tag);
  });
  params.append("category", category);
  const url = `/notion/api/post-list?${params.toString()}`;

  const response = await CmmFetch(url); // API 엔드포인트 경로
  return await response.json();
}

export async function getProperties(): Promise<NotionDatabaseProperty> {
  const response = await CmmFetch("/notion/api/property"); // API 엔드포인트 경로
  return await response.json();
}

export async function getBuildProperties(): Promise<NotionDatabaseProperty> {
  const originProperties: NotionPropertiesResult =
    await NotionClient.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });
  return notionPropsResultParse(originProperties);
}

export async function getPage(postId: string): Promise<string> {
  const params = new URLSearchParams();
  params.append("postId", postId);
  const url = `/notion/api/post?${params.toString()}`;
  const response = await CmmFetch(url); // API 엔드포인트 경로
  return await response.json();
}
