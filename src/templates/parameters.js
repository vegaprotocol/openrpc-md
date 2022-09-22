/**
 * Generate the Parameters section
 *
 * @param params
 */

const CODE = '`'

export function sectionParameters (params) {
  if (!params) {
    return ''
  }

  const output = '### Parameters'
  let header = ''
  let body = ''

  if (params.length > 0) {
    header = `| Parameter name  |  Type  |  Description |
|------------------|--------|--------|`
    body = params.map(value => {
      const name = value.required ? `**${value.name}**` : `${value.name} _(Optional)_`

      let altDescription = value?.schema?.description ? value.schema.description : value.description ? value.description : '-'

      // Currently very hardcoded to the permissions type
      if (value?.schema?.properties) {
        altDescription += '<br /><br />' + Object.keys(value.schema.properties).map(key => {
          const prop = value.schema.properties[key]

          if (prop.enum) {
            return prop.enum.map(v => `${CODE}{ "${key}": "${v}" }${CODE}`).join('<br />')
          } else {
            return ''
          }
        }).join('<br />')
      }

      return `| ${name} | ${value.schema.type} | ${altDescription.replace(/(\r\n|\n|\r)/gm, '<br />')} |`
    }).join('\r\n')
  } else {
    body = 'None required'
  }
  return `${output}
${header}
${body}`
}
