import { test } from 'tape'
import { sectionExamples } from './examples.js'

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
  t.ok(res.startsWith('## Examples'), 'Contains a second level heading')
})

test('Examples renders the example', t => {
  t.plan(5)
  const res = sectionExamples([example], 'method.name')

  t.ok(res.indexOf('## Test example'), 'Contains a section header with the example name')
  t.ok(res.indexOf('> Test example API call'), 'Contains a parameters section')
  t.ok(res.indexOf('### Parameters'), 'Contains a parameters section')
  t.ok(res.indexOf('### Result'), 'Contains a result section')
  t.equal(res.match(/```/g).length, 4, 'Contains two code blocks')
})
