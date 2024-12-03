import TokenSwap from "@/components/builders/TokenSwap";
import React from "react";

const page = () => {
  return (
    <section className="my-10 min-h-screen">
      <div className="w-full flex items-center justify-center gap-4 mb-28">
        <TokenSwap />
      </div>
    </section>
  );
};

export default page;
