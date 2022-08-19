export const CODEBLOCKOPEN = '```json'
export const CODEBLOCKCLOSE = '```'

/**
 * Generates a JSON code block markdown section
 *
 * @param code The JSON to surround
 */
export function codeBlock (code) {
  return `${CODEBLOCKOPEN}
${JSON.stringify(code, null, 4)}
${CODEBLOCKCLOSE}`
}
