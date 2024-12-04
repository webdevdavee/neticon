import StakeCrypto from "@/components/builders/StakeCrypto";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stake crypto on Neticon",
  description: "Swap Crypto Effortlessly",
};

const page = () => {
  return (
    <section className="min-h-screen">
      <StakeCrypto />
    </section>
  );
};

export default page;
