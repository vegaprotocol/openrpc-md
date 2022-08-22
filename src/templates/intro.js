
/**
 * Remove special characters that make openrpc method names invalid markdown link targets in Docusaurus
 *
 * @param {string} target
 * @returns string Acceptable link target
 */
export function makeDocusaurusCompatibleLink (target) {
  return target.replace('.', '')
}

/**
 * Generate an introductory section - currently a Table of Contents
 *
 * @param json OpenRPC schema
 */
export function sectionIntro (json) {
  if (!json || !json.methods) {
    return ''
  }

  const output = json.methods.map(m => `- [${m.name}](#${makeDocusaurusCompatibleLink(m.name)}): ${m.summary}`).join('\r\n')
  return `${output}`
}
