import { log } from "@clack/prompts";
import { existsCommand, run } from "../utils/index.mjs";

export const type = "tools";

export default async function install(s) {
	if (await existsCommand("task", "--version")) {
		log.info("task already installed, skipping");
		return;
	}

	s.start("Installing task");
	try {
		await run("bash", [
			"-c",
			"curl -1sLf 'https://dl.cloudsmith.io/public/task/task/setup.deb.sh' | sudo -E bash",
		]);
		await run("apt", ["install", "-y", "-qq", "task"]);
		s.stop("task installed");
	} catch (err) {
		s.stop("Failed to install task");
		log.error("Error installing task: " + err.message);
	}
}
