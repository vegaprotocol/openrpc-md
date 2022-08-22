#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js'
import { method } from './templates/method.js'
import { wrapper } from './templates/wrapper.js'
import { sectionIntro } from './templates/intro.js'

const target = process.argv[2]
const title = process.argv[3]

if (!target) {
  console.error('Please provide a valid OpenRPC file as a parameter')
  process.exit(1)
}

let jsonRaw, json

try {
  jsonRaw = readFileSync(target)
  json = await parseOpenRPCDocument(jsonRaw.toString())

  const output = json.methods.map(m => method(m)).join('---\r\n')

  const intro = sectionIntro(json)
  console.log(wrapper(output, intro, title))
} catch (e) {
  console.error(`Unable to open or parse ${target}`)
}
