// import Typescript from "@rollup/plugin-typescript";
import Commonjs from "@rollup/plugin-commonjs";
import Json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import Terser from "@rollup/plugin-terser";
import { defineConfig } from "rollup";
import Typescript from "rollup-plugin-typescript2";
// import KeysTransformer from "ts-transformer-keys/transformer";
// import dts from "rollup-plugin-dts";
// import tsConfig from "./tsconfig.json" assert { type: "json" };

export default defineConfig([
	{
		context: "this",
		input: "dist/server/api/index.js",
		output: {
			file: "build/index.js",
			format: "cjs",
			// file: "build/index.mjs",
			// format: "esm",
			sourcemap: true,
		},
		external: [/node_modules/],
		plugins: [
			nodeResolve({ preferBuiltins: true }),
			Typescript({
				tsconfig: "./tsconfig.json",
				/* transformers: [
					(service) => ({
						before: [KeysTransformer(service.getProgram())],
						after: [],
					}),
				], */
			}),
			Commonjs(),
			Json(),
			Terser(),
		],
	},
	/* {
		input: "api/index.ts",
		output: {
			file: "lockstep-api.d.ts",
			format: "esm",
		},
		plugins: [dts()],
	}, */
]);
