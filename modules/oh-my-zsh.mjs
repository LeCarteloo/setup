import { existsSync } from "node:fs";
import { log } from "@clack/prompts";
import { run } from "../utils/index.mjs";

export default async function install(s) {
	const ohMyZshPath = `${process.env.HOME}/.oh-my-zsh`;
	if (existsSync(ohMyZshPath)) {
		log.info(".oh-my-zsh already exists, skipping");
		return;
	}

	try {
		s.start("Installing Oh My Zsh");
		await run("sh", [
			"-c",
			"RUNZSH=no KEEP_ZSHRC=yes CHSH=no curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh | sh > /dev/null 2>&1",
		]);
		s.stop("Oh My Zsh installed");
	} catch (err) {
		s.stop("Failed to install Oh My Zsh");
		log.error("Error installing Oh My Zsh: " + err.message);
	}
}
