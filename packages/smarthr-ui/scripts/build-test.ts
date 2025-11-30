/* eslint @typescript-eslint/no-require-imports: 0 */
import path from 'node:path'

import { ECMAVersionValidatorPlugin } from 'ecma-version-validator-webpack-plugin'
import MemoryFS from 'memory-fs'
import webpack from 'webpack'

const compiler = webpack({
  mode: 'development',
  entry: path.resolve('src', 'index.ts'),
  target: ['web', 'es2022'],
  devtool: 'nosources-source-map',
  plugins: [new ECMAVersionValidatorPlugin({ ecmaVersion: 2022 })],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.build.json',
        },
      },
    ],
  },
})
compiler.outputFileSystem = new MemoryFS()
compiler.run((err, stats) => {
  if (err !== null) {
    throw err
  }
  if (stats && stats.compilation.errors.length > 0) {
    throw stats.compilation.errors
  }
})
