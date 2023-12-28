const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");

// Initializing a client
export const NotionClient = new Client({
  auth: process.env.NOTION_SECRET,
});

export const NotionToMd = new NotionToMarkdown({ notionClient: NotionClient });
