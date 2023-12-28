import { NotionToMd } from "@/src/app/api/notion/notion";

require("dotenv").config();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mdblocks = await NotionToMd.pageToMarkdown(searchParams.get("postId"));
  const mdString = NotionToMd.toMarkdownString(mdblocks);
  return Response.json(mdString.parent);
}
