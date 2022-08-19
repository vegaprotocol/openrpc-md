import { test } from 'tape'
import { sectionErrors } from './errors.js'

const error = {
  message: 'Error message',
  code: '1000',
  data: 'Test error message'
}

test('Errors renders nothing if there are no errors', t => {
  t.plan(5)

  t.equal(sectionErrors(), '', 'Empty param means no errors')
  t.equal(sectionErrors(''), '', 'Empty string means no errors')
  t.equal(sectionErrors(undefined), '', 'Undefined means no errors')
  t.equal(sectionErrors(null), '', 'Null means no errors')
  t.equal(sectionErrors([]), '', 'Empty array means no errors')
})

test('Errors renders a header if there are errors', t => {
  t.plan(1)
  const res = sectionErrors([error])
  t.ok(res.startsWith('## Errors'), 'Contains a second level heading')
})

test('Errors renders all errors', t => {
  t.plan(1)
  const res = sectionErrors([error, error])

  const expected = `## Errors
- *Error message* (1000): Test error message\r
- *Error message* (1000): Test error message`

  t.equal(res, expected, 'Generated output matches expected output')
})
