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

  let body = ''

  const header = `| Result key  |  Type  |  Description | Example |
|------------------|--------|--------|---------|`
  if (result?.schema?.properties) {
    body = Object.keys(result.schema.properties).map(key => {
      const value = result.schema.properties[key]
      const altDescription = value?.schema?.description ? value.schema.description : value.description ? value.description : '-'

      let altExamples = ''
      // Currently very hardcoded to the permissions type
      if (value?.schema?.properties) {
        altExamples += '<br /><br />' + Object.keys(value.schema.properties).map(key => {
          const prop = value.schema.properties[key]

          return prop.enum.map(v => `${CODE}{ "${key}": "${v}" }${CODE}`).join('<br />')
        }).join('<br />')
      } else if (value?.enum) {
        altExamples += value.enum.map(v => `${CODE}{ "${key}": "${v}" }${CODE}`).join('<br />')
      } else if (value?.schema?.type === 'array') {
        altExamples += `<br /><br />${CODE}['key']${CODE}`
      } else {
        altExamples = '-'
      }

      return `| ${key} | ${value.type} | ${altDescription.replace(/(\r\n|\n|\r)/gm, '<br />')} | ${altExamples.replace(/(\r\n|\n|\r)/gm, '<br />')} |`
    }).join('\r\n')
  } else if (result.name === 'No result') {
    return ''
  } else {
    console.dir(result)
    body = `| ${result.name} | ${result.schema.type} | ${result.schema.description ? result.schema.description : result.schema.items ? result.schema.items.type : result.schema.type} | ${'-'} |`
  }

  return `${output}
${header}
${body}`
}
