import { defineConfig } from "@playwright/test";

/**
 * Os testes rodam contra o site estático gerado em `out/` (npm run build).
 * PW_CHROME_PATH aponta para um Chrome específico; sem ele, usa o Chrome instalado.
 * As flags de SwiftShader permitem WebGL em máquinas sem GPU (CI); em máquinas com GPU não mudam nada.
 */
const chrome = process.env.PW_CHROME_PATH;
export default defineConfig({
  testDir: "tests",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  use: {
    baseURL: "http://localhost:3100",
    ...(chrome ? {} : { channel: "chrome" }),
    launchOptions: { ...(chrome ? { executablePath: chrome } : {}), args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
    viewport: { width: 1440, height: 900 },
    locale: "pt-BR",
  },
  webServer: { command: "node scripts/serve-out.mjs", env: { PORT: "3100" }, url: "http://localhost:3100", reuseExistingServer: true, timeout: 30_000 },
});
