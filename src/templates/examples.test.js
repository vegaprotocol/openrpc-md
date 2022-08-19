import { test } from 'tape'
import { sectionExamples, generateRequest } from './examples.js'

const example = {
  params: {
    input: true
  },
  result: {
    result: true
  },
  name: 'Test example',
  description: 'Test example API call'
}

test('Examples renders nothing if there are no examples', t => {
  t.plan(6)

  t.equal(sectionExamples(), '', 'Empty param means no errors')
  t.equal(sectionExamples(), '', 'Empty param means no errors')
  t.equal(sectionExamples(''), '', 'Empty string means no errors')
  t.equal(sectionExamples(undefined), '', 'Undefined means no errors')
  t.equal(sectionExamples(null), '', 'Null means no errors')
  t.equal(sectionExamples([]), '', 'Empty array means no errors')
})

test('Examples renders a header if there are examples', t => {
  t.plan(1)
  const res = sectionExamples([example], 'method.name')
  t.ok(res.startsWith('### Examples'), 'Contains a second level heading')
})

test('Examples renders the example', t => {
  t.plan(5)
  const res = sectionExamples([example], 'method.name')

  t.ok(res.indexOf('### Test example'), 'Contains a section header with the example name')
  t.ok(res.indexOf('> Test example API call'), 'Contains a parameters section')
  t.ok(res.indexOf('#### Parameters'), 'Contains a parameters section')
  t.ok(res.indexOf('#### Result'), 'Contains a result section')
  t.equal(res.match(/```/g).length, 4, 'Contains two code blocks')
})

test('Examples request generator handles empty method name', t => {
  t.plan(2)
  t.equal(generateRequest(), '', 'No method name, no request')
  t.equal(generateRequest(''), '', 'No method name, no request')
})

test('Examples request generator produces sample request skeleton', t => {
  t.plan(6)
  const res = generateRequest('test.method', [
    {
      name: 'key',
      value: 'value'
    },
    {
      name: 'secondKey',
      value: true
    }
  ])

  t.equal(res.id, 1, 'Request has an ID')
  t.equal(res.jsonrpc, '2.0', 'Request identifies as jsonrpc 2.0')
  t.equal(res.method, 'test.method', 'Request specifies a method')
  t.ok(res.params, 'Request has parameters')
  t.equal(res.params.key, 'value', 'Request populates specified param 1')
  t.equal(res.params.secondKey, true, 'Request populates specified param 2')
})

test('Examples request generator handles empty params', t => {
  t.plan(2)
  const undefinedParams = generateRequest('test')
  t.deepEqual(undefinedParams.params, [], 'Params is present but an empty array')

  const emptyParams = generateRequest('test', [])
  t.deepEqual(emptyParams.params, [], 'Params is present but an empty array')
})
