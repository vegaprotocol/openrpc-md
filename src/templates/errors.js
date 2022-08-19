/**
 * Generate the Errors section
 *
 * @param errors
 */
export function sectionErrors (errors) {
  if (!errors || (errors && errors.length === 0)) {
    return ''
  }

  const output = errors.map(e => `- *${e.message}* (${e.code}): ${e.data}`).join('\r\n')
  return `### Errors
${output}`
}
