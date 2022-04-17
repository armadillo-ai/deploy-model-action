# Armadillo - Model Deployment Github Action

This repository contains a GitHub action that is meant to be run whenever an ML
model gets successfully deployed on Google Cloud Run.

Here's how it works:

1. A user uses the
   [Armadillo ML SDK](https://github.com/armadillo-ai/armadillo-ml) to bootstrap
   an ML project.
2. The user writes some code to do model inference.
3. When they `git push` their code to GitHub, it triggers the
   [deploy-cloudrun](https://github.com/google-github-actions/deploy-cloudrun)
   action.
4. If and when that deployment succeeds, we run _this action_ to notify the
   Armadillo platform that the deploy was successful.
5. Armadillo saves information about the deployment - like the URL it can be
   found on - and this makes the model available as a block on the Armadillo
   platform!

## Example Usage

Here's how this is used in the repo template:

```yml
name: Deploy on Google Cloud Run

on: push

jobs:
  deploy-to-gcr:
    name: Deploy on Google Cloud Run
    runs-on: ubuntu-18.04
    permissions:
      contents: 'read'
      id-token: 'write'
    steps:
    # First, check out the repository itself, because we deploy it from source
    - id: 'checkout-repo'
      uses: actions/checkout@v3
    # Next, log into Google Cloud
    - id: 'auth'
      uses: 'google-github-actions/auth@v0'
      with:
        credentials_json: '${{ secrets.GOOGLE_CREDENTIALS }}'
        service_account: 'github-actions@armadillo-21120.iam.gserviceaccount.com'
    # Deploy to Google Cloud Run from source
    - id: 'deploy'
      uses: 'google-github-actions/deploy-cloudrun@v0'
      with:
        service: 'model-${{ github.sha }}'
        source: ./
    # Tell Armadillo that the deploy succeeded
    - id: 'update-armadillo'
      uses: 'armadillo-ai/deploy-model-action@v0.5'
      with:
        cloud-run-url: '${{ steps.deploy.outputs.url }}'
        model-id: '${{ github.repository }}'
        commit-hash: '${{ github.sha }}'
        secret: '${{ secrets.ARMADILLO_GITHUB_SECRET }}'
```
