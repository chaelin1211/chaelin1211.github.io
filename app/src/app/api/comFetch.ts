require("dotenv").config();

const BASE_URL = process.env.NODE_ENV === "production"
    ? process.env.VERCEL_URL
    : "http://localhost:3000";

export default function comFetch(url: string, options: {} = {}) {
    const prefixedUrl = `${BASE_URL}${url}`;
    return fetch(prefixedUrl, options);
}
