
/**
 * Adds frontmatter
 *
 * @param {string} content generated openrpc content
 * @param {string} title title to put in frontmatter
 * @returns string
 */
export function wrapper (content, title) {
  return `---
    title: ${title}
    hide_title: true
---

${content}
`
}
