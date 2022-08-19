import { sectionParameters } from './parameters.js'
import { sectionResult } from './result.js'
import { sectionErrors } from './errors.js'
import { sectionExamples } from './examples.js'

export function file (m) {
  return `
# ${m.name}
> ${m.summary}

${m.description}

${sectionParameters(m.params)}

${sectionResult(m.result)}

${sectionExamples(m.examples, m.name)}

${sectionErrors(m.errors)}
`
}
