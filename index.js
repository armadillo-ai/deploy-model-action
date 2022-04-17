import core from "@actions/core";
import github from "@actions/github";

try {
  const cloudRunUrl = core.getInput("cloud-run-url");
  const modelId = core.getInput("model-id");
  const commitHash = core.getInput("commit-hash");
  const environment = core.getInput("environment")
  console.log({
    cloudRunUrl,
    modelId,
    commitHash,
    environment
  })
} catch (error) {
  core.setFailed(error.message);
}