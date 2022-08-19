import { test } from 'tape'
import { method } from './method.js'

test('Method must have basic details', t => {
  t.plan(4)

  t.equal(method(), '', 'No method')
  t.equal(method({}), '', 'Missing all params')
  t.equal(method({ name: 'test' }), '', 'Missing summary, description')
  t.equal(method({ name: 'test', summary: 'test' }), '', 'Missing description')
})

test('Method with enough details generates basic outline', t => {
  t.plan(4)

  const res = method({
    name: 'Test method',
    summary: 'This method is a test',
    description: 'A fuller description'
  })

  t.ok(res.indexOf('## Test method'), 'Has a second level header')
  t.ok(res.indexOf('> This method is a test'), 'Has the summary as a quote')
  t.ok(res.indexOf('A fuller description'), 'Has the description')

  t.ok(res.indexOf('###') === -1, 'No subheaders due to no more details')
})
