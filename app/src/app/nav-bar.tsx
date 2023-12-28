import Link from "next/link";
import { getBuildProperties } from "@/src/app/notion/notion-service";
import React from "react";

const NavBar: React.FC = async () => {
  const property = await getBuildProperties();
  return (
    <ul>
      {property.category.map((post) => (
        <li key={post.id}>
          <Link href={`/${post.name}`}>{post.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export default NavBar;