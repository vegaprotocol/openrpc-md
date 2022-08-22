import { sectionParameters } from './parameters.js'
import { sectionResult } from './result.js'
import { sectionErrors } from './errors.js'
import { sectionExamples } from './examples.js'

const INLNECODEMARKER = '`'

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

## ${INLNECODEMARKER}${m.name}${INLNECODEMARKER}

${m.description}

${sectionParameters(m.params)}

${sectionResult(m.result)}

${sectionErrors(m.errors)}

${sectionExamples(m.examples, m.name)}`
}
