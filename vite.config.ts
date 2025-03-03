import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
	build: {
		rollupOptions: {
			external: ["tinymce"],
		},
	},
	server: {
		fs: {
			// Allow serving files from node_modules
			allow: [".."],
		},
	},
});
