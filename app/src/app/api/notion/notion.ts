const { Client } = require("@notionhq/client");

// Initializing a client
export const NotionClient = new Client({
  auth: process.env.NOTION_SECRET,
});
