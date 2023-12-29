import { getBuildProperties } from "@/src/app/notion/notion-service";
import React from "react";
import Header from "@/src/app/header";

const NavBar: React.FC = async () => {
  const property = await getBuildProperties();
  return <Header category={property.category} />;
};

export default NavBar;
