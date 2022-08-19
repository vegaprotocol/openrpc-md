import { readFileSync } from 'node:fs'
import { parseOpenRPCDocument } from '@open-rpc/schema-utils-js'
import { file } from './templates/file.js'

const jsonRaw = readFileSync('./test/openrpc.json')
const json = await parseOpenRPCDocument(jsonRaw.toString())

json.methods.forEach(m => {
  const output = file(m)
  console.log(output)
})
