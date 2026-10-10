import path from 'node:path'
import { fileURLToPath } from 'node:url'

import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import { globSync } from 'glob'
import preserveDirectives from 'rollup-plugin-preserve-directives'

import packageJson from './package.json' with { type: 'json' }

// 共有依存と実行時依存はすべて外に出す。利用アプリ側の解決と重複しないようにしている
const externalPackages = [
  ...Object.keys(packageJson.peerDependencies ?? {}),
  ...Object.keys(packageJson.dependencies ?? {}),
]

// react/jsx-runtime のようなsubpathも同じ依存として扱う。
// '#' 始まりはpackage.jsonのimportsで解決する内部specifierなので、そのまま出力へ残す
const isExternal = (id) =>
  id.startsWith('#') ||
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`))

const entryPoints = globSync('src/**/*.{ts,tsx}', {
  ignore: [
    '**/*.stories.{ts,tsx}',
    '**/stories/*.{ts,tsx}',
    '**/*.test.{ts,tsx}',
    '**/__tests__/*.{ts,tsx}',
  ],
})

/** @type {import('rollup').RollupOptions} */
export default {
  input: Object.fromEntries(
    entryPoints.map((file) => [
      path.relative(
        'src',
        // 拡張子を除去し書き出し時に正しいファイル名になるようにしている
        file.slice(0, file.length - path.extname(file).length),
      ),
      fileURLToPath(new URL(file, import.meta.url)),
    ]),
  ),
  output: {
    format: 'cjs',
    sourcemap: true,
    dir: 'lib',
    preserveModules: true,
    preserveModulesRoot: 'src',
    entryFileNames: '[name].cjs',
  },
  external: isExternal,
  // pnpm起因での問題がおきないようにしている
  preserveSymlinks: false,
  plugins: [
    json(),
    typescript({
      tsconfig: './tsconfig.build.json',
      noEmit: true,
    }),
    preserveDirectives({
      exclude: '**/*.json',
    }),
    commonjs(),
    nodeResolve(),
    // reactの影響でprocess is not definedになってしまうので、"production"に置き換えている
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      preventAssignment: true,
    }),
  ],
  onwarn(warning, warn) {
    // 'use client'がついていると警告が出るが問題ないため、無視する
    if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
      return
    }
    warn(warning)
  },
}
