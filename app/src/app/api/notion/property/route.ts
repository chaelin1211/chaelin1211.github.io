import {
  NotionPropertiesResult,
  notionPropsResultParse,
} from "@/src/app/notion/notion-result";

require("dotenv").config();
import { NotionClient } from "@/src/app/api/notion/notion";

export async function GET() {
  const originProperties: NotionPropertiesResult =
    await NotionClient.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });
  return Response.json(notionPropsResultParse(originProperties));
}
