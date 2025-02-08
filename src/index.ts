#!/usr/bin/env node

import fs from "fs/promises";
import Path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { Command } from "commander";
import { version } from '../package.json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

const program = new Command();

program
	.name("create-shahab")
	.description("Create a new project with Shahab's stack")
	.version(version, "-v, -V, --version", "create-shahab's version")
	.argument("<dir-name>", "Directory of the project")
	.requiredOption("-t, --template <template>", "Template name")
	.option("-f, --force", "Force create a project in a non-empty directory")
	.option("-e, --force-empty", "Force create a project in a non-empty directory, emptying it first.")
	.option("-G, --no-git", "Don't initialize a git repository")
	.option("-i, --install", "Install dependencies after creating the project")
	.action(async (dirNameRaw) => {
		const options = program.opts();

		const template = options.template;
		const dirName = Path.resolve(dirNameRaw);
		const templatePath = Path.resolve(__dirname, `../templates/${template}`);
		const isForce = options.force;
		const isForceEmpty = options.forceEmpty;

		try {
			// const doesDirExist = await fs.access(dirName);

			const isDirFull = (await fs.readdir(dirName)).length > 0;

			if (isDirFull && isForceEmpty) {
				// delete the directory, and recreate it

				console.log("Emptying the directory...");
				await fs.rm(dirName, {
					recursive: true,
				});
			}

			if (isDirFull && !(isForce || isForceEmpty)) {
				console.error(
					"The directory is not empty. To force create a project in a non-empty directory, use the `--force` flag.\n To empty the directory first, use the `--force-empty` flag."
				);
				return;
			}
		} catch (error) {
			// console.error("The directory does not exist.");
			// return;
		}

		// Check if template exists
		try {
			await fs.access(templatePath);
		} catch (error) {
			console.error("The template does not exist.");

			// Say what templates are available
			const templates = await fs.readdir(Path.resolve(__dirname, "../templates"));
			console.log("Available templates:");
			templates.forEach((template) => {
				console.log(`\t- ${template}`);
			});

			return;
		}

		console.log("Creating project in the directory:", dirName, "\n");

		await fs.mkdir(dirName, {
			recursive: true,
		});

		await fs.cp(templatePath, dirName, {
			recursive: true,
		});

		const dirFiles = await fs.readdir(dirName, { recursive: true });

		dirFiles.forEach(async (file) => {
			// cspell:ignore CREATECOMMAND
			const suffix = "CREATECOMMAND";

			const filePath = Path.resolve(dirName, file);
			if (filePath.endsWith(suffix)) {
				await fs.rename(filePath, filePath.replace(suffix, ""));
			}
		});

		if (!options.noGit) {
			console.log("Initializing git repository...");
			execSync("git init", {
				cwd: dirName,
				stdio: "inherit",
			});
		}

		if (options.install) {
			console.log("Installing dependencies...");
			execSync("yarn install", {
				cwd: dirName,
				stdio: "inherit",
			});
		}

		console.log("Project created successfully at the directory:", dirName, "\n");
		console.log("To start the project, run the following commands:\n");
		console.log(`\tcd ${dirNameRaw}`);
		if (!options.install) {
			console.log("\tyarn install");
		}

		console.log("\nHappy coding!");
	});

program.parse(process.argv);
