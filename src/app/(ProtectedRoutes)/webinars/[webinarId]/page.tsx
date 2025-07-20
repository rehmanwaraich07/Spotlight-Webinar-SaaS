import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  redirect("/webinars");
  return <div>Page</div>;
};

export default Page;
