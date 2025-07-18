import { Waitlist } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-gesit-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Link href={"/sign-in"}>Login</Link>
      </main>
    </div>
  );
};

export default Home;
