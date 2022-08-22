
/**
 * Adds frontmatter
 *
 * @param {string} content generated openrpc content
 * @param {string} title title to put in frontmatter
 * @returns string
 */
export function wrapper (content, intro, title) {
  return `---
    title: ${title}
---
${intro}

---

${content}`
}
