import { log } from "@clack/prompts";
import { existsCommand, run } from "../utils/index.mjs";

export default async function install(s) {
	if (await existsCommand("zsh", "--version")) {
		log.info("zsh already installed, skipping");
		return;
	}

	s.start("Installing zsh");
	try {
		await run("apt-get", ["install", "-y", "-qq", "zsh"]);
		s.stop("zsh installed");
	} catch (err) {
		s.stop("Failed to install zsh");
		log.error("Error installing zsh: " + err.message);
	}
}
