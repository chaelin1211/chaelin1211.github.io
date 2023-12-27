/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    env: {
        NOTION_SECRET: process.env.NOTION_SECRET,
        NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID
    },

}
module.exports = nextConfig
