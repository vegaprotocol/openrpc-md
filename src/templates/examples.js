import { codeBlock } from './codeblock.js'

export function generateRequest (method, params) {
  if (!method || method.length === 0) {
    return ''
  }

  let p
  if (params && Array.isArray(params) && params.length > 0) {
    p = {}
    params.forEach(param => { p[param.name] = param.value })
  } else {
    p = []
  }

  const wrapper = {
    id: 1,
    jsonrpc: '2.0',
    method,
    params: p
  }

  return wrapper
}

/**
 * Generate the examples section
 *
 * @param examples
 */
export function sectionExamples (examples, methodName) {
  if (!examples || (examples && examples.length === 0)) {
    return ''
  }

  // It's only required for the generated parameters object
  if (!methodName) {
    return ''
  }

  // Create a section for each example
  const output = examples.map(e => {
    const req = generateRequest(methodName, e.params)
    return `#### ${e.name}
${e.description}

##### Parameters
${codeBlock(req)}

##### Result
${codeBlock(e.result)}

`
  }).join('\r\n')

  // Output all examples under heading
  return `### Examples
${output}`
}
