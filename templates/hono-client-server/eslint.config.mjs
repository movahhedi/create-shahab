import { defineFlatConfig } from "eslint-define-config";
// import perfectionist from "eslint-plugin-perfectionist";
import MovahhediConfig from "@movahhedi/eslint-config";

const longParentPath =
	"{#,%,.," +
	Array.from({ length: 10 }, (_, i) => "../".repeat(i + 1).slice(0, -1)).join(",") +
	"}";

//#region client rules
// TODO does not work
const clientRules = {
	"@typescript-eslint/no-restricted-imports": [
		"error",
		{
			paths: [
				{
					name: "**/server/**",
					message: "Don't import server code in the client.",
					allowTypeImports: true,
				},
			],
			// patterns: [
			// 	{
			// 		group: ["**/server/**"],
			// 		importNamePattern: "^foo",
			// 	},
			// ],
		},
	],
};
//#endregion

//#region server rules
const serverRules = {
	"@typescript-eslint/no-restricted-imports": [
		"error",
		{
			paths: [
				{
					name: "**/client/*",
					message: "Don't import client code in the server.",
					allowTypeImports: true,
				},
			],
		},
	],
};
//#endregion

//#region eslint config
export default defineFlatConfig([
	...MovahhediConfig({
		tsconfig: "./tsconfig.eslint.json",
	}),

	{
		files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
		ignores: [
			// "eslint.config.*",
			"**/node_modules",
			"**/vendor",
			"**/temp/**",
			"**/dist/**",
			"**/build/**",
		],
		plugins: {
			// perfectionist: perfectionist,
		},

		rules: {},
	},
	{
		files: ["**/client/**"],
		rules: clientRules,
	},
	{
		files: ["**/server/**"],
		rules: serverRules,
	},
]);
//#endregion
