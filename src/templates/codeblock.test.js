import { test } from 'tape'
import { codeBlock, CODEBLOCKCLOSE, CODEBLOCKOPEN } from './codeblock.js'

test('Code block returns a markdown code block', t => {
  t.plan(2)

  const res = codeBlock({ test: true })

  t.ok(res.startsWith('```json'), 'The start looks correct and declares a type')
  t.ok(res.endsWith('```'), 'The codeblock ends')
})

test('Code block uses JSON.stringify on contents', t => {
  t.plan(1)

  const expectedOutput = `{
    "test": true,
    "title": "Code block test"
}`
  const res = codeBlock({ test: true, title: 'Code block test' }).replace(CODEBLOCKOPEN, '').replace(CODEBLOCKCLOSE, '').trim()
  t.equal(res, expectedOutput, 'Output contains stringified object')
})
