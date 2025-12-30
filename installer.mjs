#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
	intro,
	isCancel,
	log,
	multiselect,
	outro,
	spinner,
} from "@clack/prompts";
import pc from "picocolors";

intro("Tools setup");

if (process.getuid && process.getuid() !== 0) {
	log.error(
		"This script requires root privileges. Please run this script with sudo or as root.",
	);
	process.exit(1);
}

const modulesDir = path.resolve("./modules");
const moduleFiles = fs
	.readdirSync(modulesDir)
	.filter((f) => f.endsWith(".mjs"));

const options = moduleFiles.map((file) => {
	const value = file.replace(/\.mjs$/, "").replace(/_/g, "-");
	const label = value
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
	return { value, label };
});

const selections = await multiselect({
	message: "Select what you want to install",
	options,
});

if (isCancel(selections) || selections.length === 0) {
	outro("Nothing selected. Exiting.");
	process.exit(0);
}

const s = spinner();

for (const item of selections) {
	try {
		const modulePath = new URL(`./modules/${item}.mjs`, import.meta.url)
			.pathname;
		const mod = await import(modulePath);
		await mod.default(s);
	} catch (err) {
		log.error(`Failed to run module "${item}": ${err.message}`);
	}
}

outro(pc.green("Tools setup complete"));
