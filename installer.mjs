#!/usr/bin/env node

import {
	intro,
	isCancel,
	log,
	multiselect,
	outro,
	spinner,
} from "@clack/prompts";
import { execa } from "execa";
import { existsSync } from "fs";
import pc from "picocolors";

intro("Env setup");

if (process.getuid && process.getuid() !== 0) {
	log.error(
		"This script requires root privileges. Please run this script with sudo or as root.",
	);
	process.exit(1);
}

const selections = await multiselect({
	message: "Select what you want to install",
	options: [
		{ value: "zsh", label: "zsh" },
		{ value: "ohmyzsh", label: "Oh My Zsh" },
		{ value: "brew", label: "Homebrew (Linuxbrew)" },
		{ value: "node-brew", label: "Node.js (via Homebrew)" },
		{ value: "go", label: "Go" },
	],
});

if (isCancel(selections) || selections.length === 0) {
	outro("Nothing selected. Exiting.");
	process.exit(0);
}

// Helper functions
const run = (cmd, args) => execa(cmd, args, { stdio: "inherit" });
const existsCommand = async (cmd) => {
	try {
		await execa(cmd, ["--version"]);
		return true;
	} catch {
		return false;
	}
};
const getCommandVersion = async (cmd) => {
	try {
		const { stdout } = await execa(cmd, ["--version"]);
		return stdout.trim();
	} catch {
		return "unknown";
	}
};

const s = spinner();

for (const item of selections) {
	switch (item) {
		case "zsh":
			if (await existsCommand("zsh")) {
				log.info("zsh already installed, skipping");
				break;
			}

			s.start("Installing zsh");
			try {
				await run("apt-get", ["install", "-y", "-qq", "zsh"], {
					stdio: ["ignore", "ignore", "ignore"],
				});
				s.stop("zsh installed");
			} catch (err) {
				s.stop("Failed to install zsh");
				log.error("Error installing zsh: " + err.message);
			}
			break;

		// FIXME: This require some more work
		case "ohmyzsh": {
			const ohMyZshPath = `${process.env.HOME}/.oh-my-zsh`;
			if (existsSync(ohMyZshPath)) {
				log.info(".oh-my-zsh already exists, skipping");
				break;
			}

			try {
				s.start("Installing Oh My Zsh");
				await run(
					"sh",
					[
						"-c",
						"RUNZSH=no KEEP_ZSHRC=yes CHSH=no curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh | sh > /dev/null 2>&1",
					],
					{
						stdio: ["ignore", "ignore", "ignore"],
					},
				);
				s.stop("Oh My Zsh installed");
			} catch (err) {
				s.stop("Failed to install Oh My Zsh");
				log.error("Error installing Oh My Zsh: " + err.message);
			}
			break;
		}

		case "brew":
			if (await existsCommand("brew")) {
				log.info("Homebrew already installed, skipping");
				break;
			}
			try {
				s.start("Installing Homebrew");
				await run("sh", [
					"-c",
					"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)",
				]);
				s.stop("Homebrew installed");
			} catch (err) {
				s.stop("Failed to install Homebrew");
				log.error("Error installing Homebrew" + err.message);
			}
			break;

		case "go":
			if (await existsCommand("go")) {
				const version = await getCommandVersion("go");
				log.info(`Go already installed (${version}), skipping`);
				break;
			}
			s.start("Installing Go");
			await run("brew", ["install", "go"]);
			s.stop();
			log.success("Go installed");
			break;
	}
}

outro(pc.green("Setup complete"));
