/* app /[category] */
export const dynamicParams = false; // Dynamic segments not included in generateStaticParams will return a 404.

export async function generateStaticParams() {
    const props = await fetch("http://localhost:8000/properties").then((res) => res.json())

    // [{category: ""}, {category: ""}]
    return props.category.map((v: { name: string }) => ({category: v.name}))
}

const postList = async (category: string) => {
    const url = new URL("http://localhost:8000/post-list");
    url.searchParams.append("category", category)

    return await fetch(url.toString()).then((res) => res.json())
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
