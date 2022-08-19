/**
 * Generate the result section
 *
 * @param result
 */
export function sectionResult (result) {
  if (!result || !result.schema) {
    return ''
  }

  const output = `### Result: ${'`' + result.name + '`'}`

  if (!result.schema.properties) {
    return `${output}`
  }

  const header = `| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|`
  const body = Object.keys(result.schema.properties).map(key => {
    const value = result.schema.properties[key]

    return `| ${key} | ${value.type} | ${value.description.replace('\n\n', ' ')} | ${value.examples ? '`' + JSON.stringify(value.examples[0]) + '`' : '-'}|`
  }).join('\r\n')

  return `${output}
${header}
${body}`
}
