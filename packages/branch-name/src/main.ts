import * as core from '@actions/core'
import * as github from '@actions/github'

function generateDockerTag(name: string): string {
  if (name === 'refs/heads/master') {
    return 'latest'
  }

  return name.replace(/\//g, '_')
}

function getBranchName(name: string | undefined): string {
  if (!name) {
    throw new Error('name cannot be undefined')
  }

  if (name.match(/refs\/tags/)) {
    return name.replace('refs/tags/', '')
  }

  return name.replace('refs/heads/', '')
}

async function main(): Promise<void> {
  let branchName: string
  let dockerTag: string

  switch (github.context.eventName) {
    case 'pull_request':
      branchName = getBranchName(process.env.GITHUB_HEAD_REF)
      dockerTag = generateDockerTag(branchName)
      break
    default:
      branchName = getBranchName(github.context.ref)
      dockerTag = generateDockerTag(branchName)
  }

  core.setOutput('currentBranch', branchName)
  core.setOutput('dockerTag', dockerTag)
}

main()
