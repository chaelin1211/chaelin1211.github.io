import React from 'react';
import {getPostList} from "@/src/app/notion/notion-service";

const PostList: React.FC<{ category: string }> = async ({category}) => {
    const postList = await getPostList(category);
    return (
        <ul>
            {postList.map((item, index) => (
                <li key={index}>{item.title}</li>
            ))}
        </ul>
    );
};

export default PostList;
