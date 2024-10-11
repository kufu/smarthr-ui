/* eslint @typescript-eslint/no-require-imports: 0 */
const path = require('path')

const { ECMAVersionValidatorPlugin } = require('ecma-version-validator-webpack-plugin')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')

const compiler = webpack({
  mode: 'development',
  entry: path.resolve('src', 'index.ts'),
  target: ['web', 'es2020'],
  devtool: 'nosources-source-map',
  plugins: [new ECMAVersionValidatorPlugin({ ecmaVersion: 2020 })],
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
  if (stats.compilation.errors.length > 0) {
    throw stats.compilation.errors
  }
})
