import { log } from "@clack/prompts";
import { existsCommand, run } from "../utils/index.mjs";

export const type = "tools";

export default async function install(s) {
	if (await existsCommand("bun", "--version")) {
		log.info("Bun already installed, skipping");
		return;
	}

	s.start("Installing bun");
	try {
		await run("sh", ["-c", "npm install -g bun"]);

		s.stop("Bun installed");
	} catch (err) {
		s.stop(`Failed to install bun: ${err.message}`, 2);
	}
}
