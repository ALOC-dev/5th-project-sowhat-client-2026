import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/articles", // 시작할 때 기본주소를 localhost:5173/articles로 변경
});
