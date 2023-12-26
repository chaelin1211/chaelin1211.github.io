export interface NotionPostResult {
    results: [
        {
            properties: OriginPropsType,
            url: string
        }
    ]
}

export interface OriginPropsType {
    date: {
        id: string,
        type: string,
        date: { start: string, end: string, time_zone: string }
    },
    tags: { id: string, type: string, multi_select: [{ id: string, name: string }] },
    'sub-title': { id: string, type: string, rich_text: [{ plain_text: string }] },
    category: { id: string, type: string, rich_text: [{ plain_text: string }] },
    title: { id: string, type: string, title: [{ plain_text: string }] }
}

interface PostSimple {
    date: { start: string, end: string, time_zone: string },
    tags: [{ id: string, name: string }],
    'sub-title': string,
    category: string,
    title: string,
    url: string
}

const notionPostResultParse = (postOrigin: OriginPropsType, url: string): PostSimple => {
    return {
        date: getValueByType(postOrigin.date),
        tags: getValueByType(postOrigin.tags),
        category: getValueByType(postOrigin.category),
        'sub-title': getValueByType(postOrigin['sub-title']),
        title: getValueByType(postOrigin.title),
        url: url
    };
}

const getValueByType = (result: any) => {
    const type = result?.type;

    switch (type) {
        case "date":
            return result.date;
        case "title":
            return result.title[0]?.plain_text;
        case "rich_text":
            return result.rich_text[0]?.plain_text;
        case "multi_select":
            return result.multi_select;
    }
}

export {NotionPostResult, PostSimple, OriginPropsType, notionPostResultParse};