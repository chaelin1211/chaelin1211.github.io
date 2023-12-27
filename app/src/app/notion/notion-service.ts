import {NotionDatabaseProperty, NotionPropertiesResult, notionPropsResultParse, PostSimple} from "./notion-result";
import comFetch from "@/src/app/api/comFetch";
import {NotionClient} from "@/src/app/api/notion/notion";

require("dotenv").config();
const {Client} = require("@notionhq/client");

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_SECRET,
})

export async function getPostList(category: string = "", tags: string[] = []): Promise<PostSimple[]> {
    const params = new URLSearchParams();
    tags.forEach((tag) => {
        params.append('tags', tag);
    });
    params.append('category', category);
    const url = `/api/notion/post-list?${params.toString()}`;

    const response = await comFetch(url); // API 엔드포인트 경로
    return await response.json();
}

export async function getProperties(): Promise<NotionDatabaseProperty> {
    const response = await comFetch('/api/notion/property'); // API 엔드포인트 경로
    return await response.json();
}


export async function getBuildProperties(): Promise<NotionDatabaseProperty> {
    const originProperties: NotionPropertiesResult = await NotionClient.databases.retrieve({
        database_id: process.env.NOTION_DATABASE_ID
    });
    return notionPropsResultParse(originProperties);
}