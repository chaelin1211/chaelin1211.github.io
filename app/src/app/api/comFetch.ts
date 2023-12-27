require("dotenv").config();

export default function comFetch(url: string, options: {} = {}) {
    if (process.env.NODE_ENV !== "production"
        || window.location.hostname === 'localhost'
        || window.location.hostname === '127.0.0.1') {
        // 로컬 환경에서 실행 중
        url = `http://localhost:3000${url}`
    }

    return fetch(url, options);
}
