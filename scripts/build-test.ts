const { ECMAVersionValidatorPlugin } = require('ecma-version-validator-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const MemoryFS = require('memory-fs')

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
