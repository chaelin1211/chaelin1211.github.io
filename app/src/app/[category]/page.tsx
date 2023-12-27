/* app /[category] */
import {getProperties} from "@/src/app/notion/notion-service";
import PostList from './post-list';

export const dynamicParams = false; // Dynamic segments not included in generateStaticParams will return a 404.

export async function generateStaticParams() {
    const props = await getProperties();

    // [{category: ""}, {category: ""}]
    return props.category.map((v: { name: string }) => ({category: v.name}))
}

export default async function Page(params: { params: { category: string } }) {
    const category = params.params.category;
    return (
        <div>
            <h1>{category}</h1>
            <PostList category={category}/>
        </div>);
}
