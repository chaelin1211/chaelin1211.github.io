import {NotionPostResult, PostSimple, NotionPropertiesResult, NotionDatabaseProperty, notionPostResultParse, notionPropsResultParse} from "./notion-result";
import {NotionPostAndFilter} from "./notion-filter";

require("dotenv").config();
const {Client} = require("@notionhq/client");

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_SECRET,
})

export async function getPostList(category: string | undefined, tags: string[] = []): Promise<PostSimple[]> {
    category = category as string | undefined || "";
    tags = Array.isArray(tags)
        ? tags as string[] | undefined || []
        : [tags as string | undefined || ""];

    const notionAddFilter = new NotionPostAndFilter();
    if (category !== "") {
        notionAddFilter.addFilter("category", category)
    }
    if (tags.length > 0) {
        tags.map((v: string) => {
            notionAddFilter.addFilter("tags", v);
        })
    }

    const getPost: NotionPostResult = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        filter: notionAddFilter
    })

    return getPost.results.map((v) => {
        return notionPostResultParse(v.properties, v.url);
    })
}

export async function getProperties(): Promise<NotionDatabaseProperty> {
    const originProperties: NotionPropertiesResult = await notion.databases.retrieve({
        database_id: process.env.NOTION_DATABASE_ID
    });

    return notionPropsResultParse(originProperties);
}