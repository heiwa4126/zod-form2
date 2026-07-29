import { defineConfig } from "tsdown";

export default defineConfig([
	{
		clean: true,
		entry: ["src/index.ts"],
		format: ["esm"],
		outDir: "public/js",
		sourcemap: false,
		dts: false,
		minify: true,
		unbundle: false,
		deps: {
			alwaysBundle: ["zod"],
			onlyBundle: false
		}
	}
]);
