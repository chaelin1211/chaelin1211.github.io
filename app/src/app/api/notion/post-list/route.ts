import {NotionPostResult, notionPostResultParse} from "@/src/app/notion/notion-result";
import {NotionPostAndFilter} from "@/src/app/notion/notion-filter";
import {NotionClient} from "@/src/app/api/notion/notion";

require("dotenv").config();
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as string | undefined || "";
    const tags: string[] = searchParams.getAll("tags") as string[]|undefined || [];

    const notionAddFilter = new NotionPostAndFilter();
    if (category !== "") {
        notionAddFilter.addFilter("category", category)
    }
    if (tags.length > 0) {
        tags.map((v: string) => {
            notionAddFilter.addFilter("tags", v);
        })
    }

    const getPost: NotionPostResult = await NotionClient.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: notionAddFilter
    })

    return Response.json(getPost.results.map((v) => notionPostResultParse(v.properties, v.url)));
}
