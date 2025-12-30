import { log } from "@clack/prompts";
import { existsCommand, run } from "../utils/index.mjs";

export const type = "tools";

export default async function install(s) {
	if (await existsCommand("pnpm", "--version")) {
		log.info("Pnpm already installed, skipping");
		return;
	}

	s.start("Installing pnpm");
	try {
		// FIXME: Only needed if it's not already installed
		await run("sh", ["-c", "npm install -g corepack"]);
		await run("sh", [
			"-c",
			"corepack enable && corepack prepare pnpm@latest --activate",
		]);

		s.stop("Pnpm installed");
	} catch (err) {
		s.stop(`Failed to install pnpm: ${err.message}`, 2);
	}
}
