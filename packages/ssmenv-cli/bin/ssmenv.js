#!/usr/bin/env node
const { SSM } = require('aws-sdk')
const spawn = require('cross-spawn')
const argv = require('minimist')(process.argv.slice(2))
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
require('dotenv').config()

const CDK_STACK_NAME = process.env.CDK_STACK_NAME
const CDK_STACK_ENV = process.env.CDK_STACK_ENV

if (!CDK_STACK_NAME) {
  console.error(`Environment Variable "CDK_STACK_NAME" is missing.`)
  process.exit(1)
}

if (!CDK_STACK_ENV) {
  console.error(`Environment Variable "CDK_STACK_ENV" is missing.`)
  process.exit(1)
}

main()
  .then(() => {
    spawn(argv._[0], argv._.slice(1), { stdio: 'inherit' }).on('exit', exitCode => {
      process.exit(exitCode)
    })
  })
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

async function main() {
  const ssm = new SSM({ region: 'eu-central-1' })
  const Names = await allParametersByPath(ssm)

  const chunkedNames = Names.reduce((state, name, i) => {
    if (i % 10 === 0) state.push([])
    const currentArrayLength = state.length
    state[currentArrayLength - 1].push(name)
    return state
  }, [])

  const chunkedPromises = chunkedNames.map(Names => ssm.getParameters({ Names }).promise())
  const allChunkedResults = await Promise.all(chunkedPromises)
  const allParameters = allChunkedResults.reduce((state, results) => [...state, ...results.Parameters], [])

  console.log(`Start mapping AWS SSM store parameters /${CDK_STACK_NAME}/${CDK_STACK_ENV}/ to environment variables.`)

  allParameters.forEach(({ Name, Value }) => {
    const key = Name.replace(`/${CDK_STACK_NAME}/${CDK_STACK_ENV}/`, '')
    const value = Value
    const hasExistingValue = Boolean(process.env[key])

    if (hasExistingValue) return console.log(`Dublicate : ${key}`)

    console.log(`Created   : ${key}`)
    process.env[key] = value
  })
}

async function allParametersByPath(ssm, names = [], nextToken) {
  const { Parameters = [], NextToken } = await ssm
    .getParametersByPath({ Path: `/${CDK_STACK_NAME}/${CDK_STACK_ENV}`, NextToken: nextToken })
    .promise()

  const Names = [...names, ...Parameters.map(({ Name }) => Name)]

  return NextToken ? await allParametersByPath(ssm, Names, NextToken) : Names
}
