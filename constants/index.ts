export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const supportedChains = [
  { src: "/images/ethereum.svg", alt: "ethereum", name: "Ethereum" },
  { src: "/images/arbitrum.svg", alt: "arbitrum", name: "Arbitrum" },
  { src: "/images/optimism.svg", alt: "optimism", name: "Optimism" },
  { src: "/images/polygon.svg", alt: "polygon", name: "Polygon" },
];
