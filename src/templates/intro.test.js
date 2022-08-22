import { test } from 'tape'
import { sectionIntro, makeDocusaurusCompatibleLink } from './intro.js'

test('Intro renders nothing if there are no methods', t => {
  t.plan(5)

  t.equal(sectionIntro(), '', 'Empty param means no errors')
  t.equal(sectionIntro(''), '', 'Empty string means no errors')
  t.equal(sectionIntro(undefined), '', 'Undefined means no errors')
  t.equal(sectionIntro(null), '', 'Null means no errors')
  t.equal(sectionIntro([]), '', 'Empty array means no errors')
})

test('Intro renders a table of contents', t => {
  t.plan(4)
  const testData = {
    methods: [
      {
        name: 'method.one',
        summary: 'MethodOne summary'
      },
      {
        name: 'method.two',
        summary: 'MethodTwo summary'
      }
    ]
  }

  const res = sectionIntro(testData)

  t.ok(res.match(/method.one/g), 'Method one has an entry in the TOC')
  t.ok(res.match(/MethodOne/g), 'Method one has a summary in the TOC')
  t.ok(res.match(/method.two/g), 'Method two has an entry in the TOC')
  t.ok(res.match(/MethodTwo/g), 'Method two has a summary in the TOC')
})

test('Docusaurus compatible link maker removes appropriate characters', t => {
  t.plan(2)

  t.equal(makeDocusaurusCompatibleLink('test.method_name'), 'testmethod_name', 'Dot is removed, underscore stays')
  t.equal(makeDocusaurusCompatibleLink('.method_name'), 'method_name', 'Leading dot is removed, underscore stays')
})
