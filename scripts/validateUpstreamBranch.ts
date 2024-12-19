import { execSync } from "node:child_process";

function getCurrentBranch(): string {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
  } catch {
    console.error("❌ Error: Unable to determine the current branch.");
    process.exit(1);
  }
}

function getUpstreamOf(branch: string): string | null {
  try {
    return execSync(`git rev-parse --abbrev-ref ${branch}@{u} 2>/dev/null`, { encoding: "utf-8" }).trim();
  } catch {
    return null;
  }
}

function notifyCheckoutRules(): void {
  console.log(`
🔔 **IMPORTANT: ETS PR RULES**
- All changes must be PR'ed to 'stage' branch first
  `);
}

function setUpstream(branch: string, upstreamBranch: string): void {
  try {
    execSync(`git branch --set-upstream-to=origin/${upstreamBranch} ${branch}`);
    console.log(`✅ Upstream for branch "${branch}" has been set to "origin/${upstreamBranch}".`);
  } catch {
    console.error(`❌ Error: Unable to set upstream for branch "${branch}".`);
  }
}

function validateCommitRestrictions(): void {
  const branch = getCurrentBranch();
  const upstream = getUpstreamOf(branch);

  if (!upstream) {
    console.error(
      `❌ Error: The branch "${branch}" does not have an upstream set. Please set the upstream before committing.
To set an upstream branch, use:

  git branch --set-upstream-to origin/stage
      `,
    );
    process.exit(1);
  }

  if (upstream !== "origin/stage") {
    console.error(`
❌ Commit blocked: All branches must target 'stage' as upstream.
Current upstream: ${upstream}

Please adjust your branch upstream:
  git branch --set-upstream-to origin/stage
    `);
    process.exit(1);
  }
}

function handlePostCheckout(): void {
  const branch = getCurrentBranch();
  const upstream = getUpstreamOf(branch);

  if (!upstream) {
    setUpstream(branch, "stage");
  }

  notifyCheckoutRules();
}

function handlePreCommit(): void {
  validateCommitRestrictions();
}

function main(): void {
  const hookType = Bun.argv[2]; // Pass 'post-checkout' or 'pre-commit' as the argument

  switch (hookType) {
    case "post-checkout":
      handlePostCheckout();
      break;
    case "pre-commit":
      handlePreCommit();
      break;
    default:
      console.error("❌ Error: Unknown hook type. Expected 'post-checkout' or 'pre-commit'.");
      process.exit(1);
  }
}

main();
