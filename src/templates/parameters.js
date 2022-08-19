/**
 * Generate the Parameters section
 *
 * @param params
 */
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
      return `| ${name} | ${value.schema.type} | ${value.description ? value.description.replace(/(\r\n|\n|\r)/gm, '') : '-'} |`
    }).join('\r\n')
  } else {
    body = 'None required'
  }
  return `${output}
${header}
${body}`
}
