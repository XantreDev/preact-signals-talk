import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "module:@preact/signals-react-transform",
            {
              mode: "all",
            },
          ],
        ],
      },
    }),
    tsconfigPaths(),
  ],
});
