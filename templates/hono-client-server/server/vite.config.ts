// cspell:ignore ttypescript
import Path from "path";

// import Typescript from "@rollup/plugin-typescript";
import HonoDevServer from "@hono/vite-dev-server";
import Dotenv from "dotenv";
// import Ttypescript from "ttypescript";
import { defineConfig, loadEnv } from "vite";

//#region Node Internal Modules
const nodeInternalModules = [
	"assert",
	"async_hooks",
	"buffer",
	"child_process",
	"cluster",
	"console",
	"constants",
	"crypto",
	"dgram",
	"dns",
	"domain",
	"events",
	"fs",
	// "fs/promises",
	"http",
	"http2",
	"https",
	"inspector",
	"module",
	"net",
	"os",
	"path",
	"perf_hooks",
	"process",
	"punycode",
	"querystring",
	"readline",
	"repl",
	"stream",
	"string_decoder",
	"timers",
	"tls",
	"trace_events",
	"tty",
	"url",
	"util",
	"v8",
	"vm",
	"worker_threads",
	"zlib",
];
//#endregion

Dotenv.config({ path: ".env.build" });
const shouldBundleDependencies = !!+(process.env.SHOULD_BUNDLE_DEPENDENCIES || true);

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

	return {
		plugins: [
			/* ...VitePluginNode({
				adapter: "koa",
				appPath: "./api/index.ts",
			}), */
			/* Typescript({
				typescript: Ttypescript,
			}), */
			HonoDevServer({
				entry: "./api/index.ts",
			}),
		],
		build: {
			target: "esnext",
			outDir: "dist",
			minify: "terser",
			emptyOutDir: true,
			terserOptions: {
				format: {
					comments: false,
					shebang: true,
				},
				mangle: {
					properties: false,
				},
			},
			rollupOptions: {
				input: "./api/index.ts",

				/* output: {
					esModule: true,
					format: "es",
					exports: "auto",
				}, */

				external: (id) => {
					// console.log(id);
					// There was an import named `"string_decoder/"` with a trailing slash
					if (id.endsWith("/") || id.endsWith("\\")) {
						return false;
					}

					if (id.startsWith(".")) return false;
					if (id.startsWith("@/shared")) return false;
					if (Path.isAbsolute(id)) return false;


					if (id.startsWith("%")) return false;

					if (
						id.startsWith("node:") ||
						nodeInternalModules.find(
							(nodeInternalName) =>
								id === nodeInternalName ||
								id.startsWith(nodeInternalName + "/"),
						)
					)
						return true;
					// if (nodeInternalModules.includes(id)) return true;

					return shouldBundleDependencies ? false : true;
				},
			},
			commonjsOptions: {
				include: /node_modules/,
			},
		},
		server: {
			// hmr: true,
			port: +(process.env.PORT || 3000),
		},
	};
});
