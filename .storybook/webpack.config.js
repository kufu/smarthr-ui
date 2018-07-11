const path = require('path')

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, '../packages/smarthr-ui/src'),
    loader: require.resolve('awesome-typescript-loader'),
  })
  defaultConfig.resolve.extensions.push('.ts', '.tsx')

  return defaultConfig
}
