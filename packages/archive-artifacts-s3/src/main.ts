import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function main(): Promise<void> {
  try {
    const artifactPath = core.getInput('artifactPath', {
      required: true
    })
    const bucketName = core.getInput('bucketName', {
      required: true
    })
    const prefix = core.getInput('prefix', {
      required: true
    })
    const generatePresignedURL =
      core.getInput('generatePresignedURL') === 'true'
    const presignedURLTTLSeconds = core.getInput('presignedURLTTLSeconds')
    const s3Link = `s3://${bucketName}/${prefix}`
    await exec.exec(
      `aws s3 sync ${artifactPath} ${s3Link} --acl bucket-owner-full-control`
    )

    core.setOutput('s3Link', s3Link)

    if (generatePresignedURL) {
      await exec.exec(
        `aws s3 presign ${s3Link} --expires-in ${presignedURLTTLSeconds}`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

main()
