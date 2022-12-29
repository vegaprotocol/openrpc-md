import { test } from 'tape'
import { sectionResult } from './result.js'

test('Result must have basic details', t => {
  t.plan(4)

  t.equal(sectionResult(), '', 'No result')
  t.equal(sectionResult({}), '', 'Result does not have a schema property')
  t.equal(sectionResult({ name: 'test' }), '', 'Missing schema')
  t.equal(sectionResult({ schema: 'test' }), '', 'Missing name')
})

test('A result with a schema but no properties gets a very basic treatment', t => {
  t.plan(2)

  const input = {
    name: 'Testtext',
    schema: {
      notProperties: 'anything'
    }
  }

  const res = sectionResult(input)

  t.ok(res.startsWith('### Result:'), 'Output starts with a third level header')
  t.ok(res.endsWith('`' + input.name + '`'), 'Header contains schema name in a code block')
})

test('Results descriptions examples format correctly', t => {
  t.plan(16)

  const input = {
    name: 'Testtextdescriptions',
    schema: {
      properties: {
        firstProp: {
          type: 'string',
          description: 'descriptionOfFirstPropFromDescription',
          schema: {
            description: 'descriptionOfFirstPropFromSchemaDescription'
          }
        },
        secondProp: {
          type: 'string',
          description: 'descriptionOfSecondPropFromDescription'
        },
        thirdProp: {
          type: 'string'
        },
        fourthProp: {
          description: 'thisOneHasNoType'
        }
      }
    }
  }

  const res = sectionResult(input)
  const resRows = res.split(/\r?\n|\r|\n/g)

  resRows.forEach((row, index) => {
    if (index <= 2) {
      // lazy noop
    } else {
      const cols = row.split('|')
      if (index === 3) {
        t.equal(cols[1].trim(), 'firstProp', 'Name comes from the key of the prop')
        t.equal(cols[2].trim(), 'string', 'Type comes from the type prop')
        t.equal(cols[3].trim(), 'descriptionOfFirstPropFromSchemaDescription', 'Schema description takes precedence')
        t.equal(cols[4].trim(), 'descriptionOfFirstPropFromSchemaDescription', 'Description also populates example (unsure why)')
      } else if (index === 4) {
        t.equal(cols[1].trim(), 'secondProp', 'Name comes from the key of the prop')
        t.equal(cols[2].trim(), 'string', 'Type comes from the type prop')
        t.equal(cols[3].trim(), 'descriptionOfSecondPropFromDescription', 'Prop description is used of schema description is missing')
        t.equal(cols[4].trim(), 'descriptionOfSecondPropFromDescription', 'Description also populates example (unsure why)')
      } else if (index === 5) {
        t.equal(cols[1].trim(), 'thirdProp', 'Name comes from the key of the prop')
        t.equal(cols[2].trim(), 'string', 'Type comes from the type prop')
        t.equal(cols[3].trim(), '-', 'Missing schema and description prop gets a -')
        t.equal(cols[4].trim(), '-', 'Missing schema and description prop gets a -')
      } else if (index === 6) {
        t.equal(cols[1].trim(), 'fourthProp', 'Name comes from the key of the prop')
        t.equal(cols[2].trim(), '', 'Type does not render undefined')
        t.equal(cols[3].trim(), 'thisOneHasNoType', 'Prop description is used')
        t.equal(cols[4].trim(), 'thisOneHasNoType', 'Prop description is used')
      }
    }
  })
})
