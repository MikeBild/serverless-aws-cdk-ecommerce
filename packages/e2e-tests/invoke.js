const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()
const [_, __, count = 1] = process.argv

invokeE2E(parseInt(count))

async function invokeE2E(count) {
  const lambdaInvokeList = new Array(count).fill({}).map(() =>
    lambda
      .invoke({
        FunctionName: 'e2e-tests-function',
        InvocationType: 'RequestResponse',
        LogType: 'Tail',
        Payload: JSON.stringify({}),
      })
      .promise()
      .catch(error => ({ LogResult: error.message, Payload: '{}' }))
  )

  try {
    const lambdaResults = await Promise.all(lambdaInvokeList)
    lambdaResults.forEach(({ LogResult, Payload }) => {
      const logResults = Buffer.from(LogResult, 'base64').toString('ascii')
      const {
        results: { success, numFailedTests, numPassedTests, numPendingTests },
      } = JSON.parse(Payload)
      console.log(logResults)
      console.log({ success, numFailedTests, numPassedTests, numPendingTests })
    })
  } catch (error) {
    console.error(error)
  }
}
