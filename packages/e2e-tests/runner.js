const jest = require('jest')
const chrome = require('chrome-aws-lambda')

module.exports = { run }

async function run() {
  try {
    return await jest.runCLI({ rootDir: './tests', json: true, silent: true, runInBand: true }, [__dirname])
  } catch (error) {
    return error
  }
}
