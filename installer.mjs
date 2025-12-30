#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
	groupMultiselect,
	intro,
	isCancel,
	log,
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

const options = await Promise.all(
	moduleFiles.map(async (file) => {
		const value = file.replace(/\.mjs$/, "").replace(/_/g, "-");

		const label = value
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");

		const mod = await import(`./modules/${file}`);

		return {
			value,
			label,
			type: mod.type,
			installFn: mod.default,
		};
	}),
);

const groupedOptions = options.reduce((acc, opt) => {
	const group = opt.type
		? opt.type.charAt(0).toUpperCase() + opt.type.slice(1)
		: "Other";
	if (!acc[group]) acc[group] = [];
	acc[group].push(opt);
	return acc;
}, {});

const selections = await groupMultiselect({
	message: "Select what you want to install",
	options: groupedOptions,
});

if (isCancel(selections) || selections.length === 0) {
	outro("Nothing selected. Exiting.");
	process.exit(0);
}

const s = spinner();

for (const item of selections) {
	try {
		const mod = options.find((opt) => opt.value === item);
		await mod.installFn(s);
	} catch (err) {
		log.error(`Failed to run module "${item}": ${err.message}`);
	}
}

outro(pc.green("Tools setup complete"));
