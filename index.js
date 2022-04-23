import core from "@actions/core";
import github from "@actions/github";
import axios from "axios";

const armadilloUrls = {
  // Temporarily switching for demo.
  'PROD': 'https://web-8f4xb352y-armadillo-ai.vercel.app/',
  // 'PROD': 'https://www.witharmadillo.com/',
  'DEV': 'https://dev.witharmadillo.com/'
}

try {
  const cloudRunUrl = core.getInput("cloud-run-url");
  const modelId = core.getInput("model-id");
  const commitHash = core.getInput("commit-hash");
  const environment = core.getInput("environment")
  const armadilloGithubSecret = core.getInput("secret")
  const status = core.getInput("status")

  console.log({
    cloudRunUrl,
    modelId,
    commitHash,
    environment,
    armadilloGithubSecret,
    status,
  })

  // Example Output:
  // const sampleOutput = {
  //   cloudRunUrl: 'https://model-7082e3d73ba5d0790a5761439de5cfa6a7c24f17-iv7xltpeca-uc.a.run.app',
  //   modelId: 'armadillo-ai/automated-test',
  //   commitHash: '7082e3d73ba5d0790a5761439de5cfa6a7c24f17',
  //   environment: 'PROD'
  //   armadilloGithubSecret: '<<REDACTED>>'
  //   status: 'SUCCESS,
  // }

  if (!armadilloUrls.hasOwnProperty(environment)) {
    throw new Error(`Environment ${environment} is not supported`)
  }

  const baseUrl = armadilloUrls[environment];
  const fullUrl = `${baseUrl}/api/github/modelDeployment`;
  axios.post(fullUrl, {
    cloudRunUrl,
    modelId,
    commitHash,
    status,
  }, {
    headers: {
      "ARMADILLO-GITHUB-SECRET": armadilloGithubSecret,
    }
  })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));


} catch (error) {
  core.setFailed(error.message);
}