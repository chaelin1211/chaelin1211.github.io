/* app /[category] */
import {getPostList, getProperties} from "../(notion)/notion-service";

export const dynamicParams = false; // Dynamic segments not included in generateStaticParams will return a 404.

export async function generateStaticParams() {
    const props = await getProperties();

    // [{category: ""}, {category: ""}]
    return props.category.map((v: { name: string }) => ({category: v.name}))
}

const postList = async (category: string) => {
    return await getPostList(category);
}

export default async function Page(params: { params: { category: string } }) {
    const category = params.params.category;
    const posts = await postList(category);
    console.log(posts)
    return (
        <div>
            <h1>{category}</h1>
            <ul>
                {posts.map((post: {title: string}) => (
                    // 반복되는 요소에는 고유한 key 속성을 제공해야 합니다.
                    <li key={post.title}>{post.title}</li>
                ))}
            </ul>
        </div>);
}
