/**
 * Generate the result section
 *
 * @param result
 */
const CODE = '`'

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
    let altDescription = value?.schema?.description ? value.schema.description : value.description ? value.description : '-'

    const altExamples = value?.schema?.description ? value.schema.description : value.description ? value.description : '-'

    // Currently very hardcoded to the permissions type
    if (value?.schema?.properties) {
      altDescription += '<br /><br />' + Object.keys(value.schema.properties).map(key => {
        const prop = value.schema.properties[key]

        return prop.enum.map(v => `${CODE}{ "${key}": "${v}" }${CODE}`).join('<br />')
      }).join('<br />')
    }

    return `| ${key} | ${value.type} | ${altDescription.replace(/(\r\n|\n|\r)/gm, '<br />')} | ${altExamples.replace(/(\r\n|\n|\r)/gm, '<br />')}} |`
  }).join('\r\n')

  return `${output}
${header}
${body}`
}
