import { readFileSync } from 'node:fs'
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js'
import { method } from './templates/method.js'

const jsonRaw = readFileSync('./test/openrpc.json')
const json = await parseOpenRPCDocument(jsonRaw.toString())

json.methods.forEach(m => {
  const output = method(m)
  console.log(output)
})
