import type { NextConfig } from "next";

// Exportação estática: o site inteiro vira HTML/JS/CSS em `out/`, publicável em qualquer hospedagem.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default config;
