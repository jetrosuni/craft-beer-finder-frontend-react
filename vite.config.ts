import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA, type VitePWAOptions } from "vite-plugin-pwa";

const pwaOptions: Partial<VitePWAOptions> = {
  injectRegister: "auto",
  manifest: {
    name: "Craft Beer Finder",
    short_name: "CBF",
    description: "Find the best beers in town",
    theme_color: "#171717",
    icons: [
      {
        src: "img/icons/pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "img/icons/pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "img/icons/pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "img/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"],
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: "/react-beer-finder/", // NOTE: Change to match the production environment
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
    },
    plugins: [
      react(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      VitePWA(pwaOptions),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/assets/scss/variables.scss";`,
        },
      },
    },
    optimizeDeps: {
      exclude: ["tw-elements"],
    },
    server: {
      watch: {
        usePolling: true,
      },
      host: true, // needed for the Docker Container port mapping to work
      strictPort: true,
      port: 9880,
    },
  };
});
