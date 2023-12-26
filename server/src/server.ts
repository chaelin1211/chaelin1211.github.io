import express, {Request, Response} from "express";
import {NotionPostResult, PostSimple, NotionPropertiesResult, NotionDatabaseProperty, notionPostResultParse, notionPropsResultParse} from "./notion-result";
import {NotionPostAndFilter} from "./notion-filter";

require("dotenv").config();
const {Client} = require("@notionhq/client");

const app = express();
const PORT = 8000;

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_SECRET,
})

app.get("/post-list", async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined || "";
    const tags: string[] = Array.isArray(req.query.tags)
        ? req.query.tags as string[] | undefined || []
        : [req.query.tags as string | undefined || ""];

    // Avoid CORS errors
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    const notionAddFilter = new NotionPostAndFilter();
    if (!category) {
        notionAddFilter.addFilter("category", category);
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

    const postList: PostSimple[] = getPost.results.map((v) => {
        return notionPostResultParse(v.properties, v.url);
    })

    res.json(postList);
});

app.get("/properties", async (req: Request, res: Response) => {
    // Avoid CORS errors
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    const originProperties: NotionPropertiesResult = await notion.databases.retrieve({
        database_id: process.env.NOTION_DATABASE_ID
    });
    const properties: NotionDatabaseProperty = notionPropsResultParse(originProperties);

    res.json(properties);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});