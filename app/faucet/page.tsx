import Faucet from "@/components/builders/Faucet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neticon request tokens",
  description: "Swap Crypto Effortlessly",
};

const page = () => {
  return (
    <section className="min-h-screen">
      <Faucet />
    </section>
  );
};

export default page;
