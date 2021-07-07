import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import { sys } from 'typescript'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

import { Extractor, ExtractorConfig } from '@microsoft/api-extractor'

const PROD = !!process.env.CI

console.log(`production: ${PROD}`)
const packageJsonPath = sys.resolvePath('./package.json')
const packageJson = JSON.parse(sys.readFile(packageJsonPath))

console.assert(packageJson.name, 'package.json .name must be present')
console.assert(
  packageJson.decentralandLibrary,
  'package.json .decentralandLibrary must be an object'
)
console.assert(packageJson.main, 'package.json .main must be present')
console.assert(packageJson.typings, 'package.json .typings must be present')



const plugins = [
  typescript({
    verbosity: 2,
    clean: true
  }),
  resolve({
    browser: true,
    preferBuiltins: false
  }),
  commonjs({
    ignoreGlobal: true,
    include: [/node_modules/],
    namedExports: {}
  }),

  PROD && terser({})
]

export default {
  input: './src/index.ts',
  context: 'globalThis',
  plugins,
  external: /(@decentraland\/|@dcl\/**)/,
  output: [
    {
      file: './dist/index.js',
      format: 'amd',
      name: '@pmacom/dclconnect',
      sourcemap: true,
      amd: {
        id: '@pmacom/dclconnect'
      }
    }
  ]
}
