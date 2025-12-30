import { execa } from "execa";

export function run(cmd, args) {
	return execa(cmd, args, { stdio: ["ignore", "ignore", "ignore"] });
}

export async function existsCommand(cmd, versionArg) {
	try {
		await execa(cmd, [versionArg]);
		return true;
	} catch {
		return false;
	}
}

export async function getCommandVersion(cmd, versionArg) {
	try {
		const { stdout } = await execa(cmd, [versionArg]);
		return stdout.trim();
	} catch {
		return "unknown";
	}
}
