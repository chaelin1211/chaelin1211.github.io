/* app /[category] */
export const dynamicParams = false; // Dynamic segments not included in generateStaticParams will return a 404.

export async function generateStaticParams() {
    const props = await fetch("http://localhost:8000/properties").then((res) => res.json())

    // [{category: ""}, {category: ""}]
    return props.category.map((v: {name: string}) => ({category: v.name}))
}

export default function Page(params: {params: { category: string }}) {
    return <div>{params.params.category}</div>;
}
