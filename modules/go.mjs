import { log } from "@clack/prompts";
import { existsCommand, getCommandVersion, run } from "../utils/index.mjs";

export default async function install(s) {
	if (await existsCommand("go", "version")) {
		const version = await getCommandVersion("go", "version");
		log.info(`Go already installed (${version}), skipping`);
		return;
	}

	try {
		s.start("Installing Go");
		await run("apt-get", ["install", "-y", "-qq", "golang-go"]);
		s.stop("Go installed");
	} catch (err) {
		s.stop("Failed to install Go");
		log.error("Error installing Go: " + err.message);
	}
}
