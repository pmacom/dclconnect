
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import { sys } from 'typescript'
import typescript from 'rollup-plugin-typescript2'

const PROD = !!process.env.CI

console.log(`production: ${PROD}`)
const packageJsonPath = sys.resolvePath('./package.json')
const packageJson = JSON.parse(sys.readFile(packageJsonPath))

const plugins = [
  typescript({
    verbosity: 2,
    rollupCommonJSResolveHack: false,
    clean: true,
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
  copy({
    targets: [
      { src: 'assets/images', dest: 'dist/assets' },
      { src: 'assets/models', dest: 'dist/assets' },
      { src: 'assets/sounds', dest: 'dist/assets' },
    ]
  }),
  PROD && terser({})
]

export default {
  input: './src/index.ts',
  context: 'globalThis',
  plugins,
  external: ['@dcl/ecs-scene-utils'],
  output: [
    {
      file: './dist/index.js',
      format: 'amd',
      name: 'dclconnect',
      sourcemap: true,
      amd: {
        id: 'dclconnect'
      }
    }
  ]
}
