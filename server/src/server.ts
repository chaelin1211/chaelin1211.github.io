import express, { Request, Response } from "express";
import {NotionPostResult, PostSimple, OriginPropsType, notionPostResultParse} from "./notionResult";
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
    const tags: string[] = req.query.tags as string[] | undefined || [];

    // Avoid CORS errors
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Content-Type", "application/json");

    const getPost: NotionPostResult = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID
    })

    const postList: PostSimple[] = getPost.results.map((v) => {
        return notionPostResultParse(v.properties, v.url);
    })

    console.log(postList);
    res.json(postList);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});