import * as core from '@actions/core'

async function main(): Promise<void> {
  try {
    let input = core.getInput('input', {
      required: true
    })

    input = input.toLowerCase()

    const blacklistCSV = core.getInput('blacklist', {
      required: true
    })

    let blacklist = blacklistCSV.split(',')
    blacklist = blacklist.map(b => b.toLowerCase())

    core.info(`Input to validate: ${input}`)
    core.info(`Input to validate against ${blacklist}`)

    if (blacklist.includes(input)) {
      core.error(`Input: ${input} part of blacklist: ${blacklist}`)
      throw new Error(`Input: ${input} part of blacklist: ${blacklist}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
