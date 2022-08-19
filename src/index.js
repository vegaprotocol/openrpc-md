#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js'
import { method } from './templates/method.js'

const target = process.argv[2]

if (!target) {
  console.error('Please provide a valid OpenRPC file as a parameter')
  process.exit(1);
}

let jsonRaw, json

try {
  jsonRaw = readFileSync(target)
  json = await parseOpenRPCDocument(jsonRaw.toString())

  json.methods.forEach(m => {
    const output = method(m)
    console.log(output)
  })
} catch (e) {
  console.error(`Unable to open or parse ${target}`)
}

