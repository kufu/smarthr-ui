import { dirname } from 'path'
import { fileURLToPath } from 'url'

import * as esbuild from 'esbuild'
import { globSync } from 'glob'

import packageJson from '../package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const peerDependencies = packageJson.peerDependencies
  ? Object.keys(packageJson.peerDependencies)
  : []

const entryPoints = globSync('src/**/*.{ts,tsx}', {
  ignore: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}'],
  cwd: __dirname,
})

const config: esbuild.BuildOptions = {
  entryPoints: ['src/index.ts', ...entryPoints],
  outdir: 'esm',
  bundle: true,
  splitting: true,
  treeShaking: true,
  platform: 'browser',
  format: 'esm',
  target: ['esnext'],
  jsx: 'automatic',
  tsconfig: 'tsconfig.esm.build.json',
  sourcemap: true,
  external: [...peerDependencies],
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
}

;(async () => {
  try {
    await esbuild.build(config)
    console.log('Build completed successfully.')
  } catch (error) {
    console.error('Error during build:', error)
    process.exit(1)
  }
})()
