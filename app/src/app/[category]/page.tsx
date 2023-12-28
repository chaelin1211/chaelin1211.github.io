/* app /[category] */
import { getBuildProperties } from "@/src/app/notion/notion-service";
import PostList from "./post-list";
import LoadingPage from "@/src/app/loading";
import { Suspense } from "react";

export const dynamicParams = false; // Dynamic segments not included in generateStaticParams will return a 404.

export async function generateStaticParams() {
  const props = await getBuildProperties();

  // [{category: ""}, {category: ""}]
  return props.category.map((v: { name: string }) => ({ category: v.name }));
}

export default async function Page(params: { params: { category: string } }) {
  const category = params.params.category;
  return (
    <div>
      <h1>{category}</h1>
      <Suspense fallback={<LoadingPage />}>
        <PostList category={category} />
      </Suspense>
    </div>
  );
}
