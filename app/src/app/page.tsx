import {getBuildProperties} from "@/src/app/notion/notion-service";

export default async function Home() {
    const property = await getBuildProperties();
    return (
        <main>
            <h1>Chaelin&apos;s Blog (Temp)</h1>
            <ul>
                {property.category.map(v=> (
                    <li key={v.id}>{v.name}</li>
                ))}
            </ul>
        </main>
    )
}
