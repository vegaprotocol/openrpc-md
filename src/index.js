import { readFileSync } from 'node:fs'
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js'

const CODEBLOCKOPEN = '```json'
const CODEBLOCKCLOSE = '```'

/**
 * Generates a JSON code block markdown section
 *
 * @param code The JSON to surround
 */
function codeBlock (code) {
  return `${CODEBLOCKOPEN}
${JSON.stringify(code, null, 4)}
${CODEBLOCKCLOSE}`
}

/**
 * Generate the Parameters section
 *
 * @param params
 */
function sectionParameters (params) {
  if (!params) {
    return ''
  }

  const output = params.map(e => 'test').join('\r\n')
  return `## Parameters
${output}`
}

/**
 * Generate the result section
 *
 * @param result
 */
function sectionResult (result) {
  if (!result || !result.schema) {
    return ''
  }

  const output = `## Result: ${'`' + result.name + '`'}`

  if (!result.schema.properties) {
    return `${output}`
  }

  console.dir(result.schema.properties)

  const header = `| Parameter name  |  Type  |  Description | Example |
|------------------|--------|--------|---------|`
  const body = Object.keys(result.schema.properties).map(key => {
    const value = result.schema.properties[key]

    return `| ${key} | ${value.type} | ${value.description.replace('\n\n', ' ')} | ${value.examples ? '`' + JSON.stringify(value.examples[0]) + '`' : '-'}|`
  }).join('\r\n')

  return `${output}
${header}
${body}`
}
/**
 * Generate the Errors section
 *
 * @param errors
 */
function sectionErrors (errors) {
  if (!errors) {
    return ''
  }

  const output = errors.map(e => `*${e.message}* (${e.code}): ${e.data}`).join('\r\n')
  return `## Errors
${output}`
}

/**
 * Generate the examples section
 *
 * @param examples
 */
function sectionExamples (examples) {
  if (!examples) {
    return ''
  }

  const output = examples.map(e => `### ${e.name}
> ${e.description}

#### Parameters
${codeBlock(e.params)}
#### Result
${codeBlock(e.result)}
`)
  return `## Examples
${output}`
}

/*************************************************/
const jsonRaw = readFileSync('./test/openrpc.json')
const json = await parseOpenRPCDocument(jsonRaw.toString())

json.methods.forEach(m => {
  const output = `
# ${m.name}
> ${m.summary}

${m.description}

${sectionParameters(m.params)}

${sectionResult(m.result)}

${sectionExamples(m.examples)}

${sectionErrors(m.errors)}
`
  console.log(output)
})
