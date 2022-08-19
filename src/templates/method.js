import { sectionParameters } from './parameters.js'
import { sectionResult } from './result.js'
import { sectionErrors } from './errors.js'
import { sectionExamples } from './examples.js'

/**
 * Generate the markdown output for an OpenRPC method
 *
 * @param m Method object
 */
export function method (m) {
  // Return blank if the method is too sparse
  if (!m || !m.name || !m.summary || !m.description) {
    return ''
  }

  return `
## ${m.name}
> ${m.summary}

${m.description}

${sectionParameters(m.params)}

${sectionResult(m.result)}

${sectionExamples(m.examples, m.name)}

${sectionErrors(m.errors)}
`
}
