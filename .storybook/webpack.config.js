const path = require('path')

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          query: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  targets: {
                    Chrome: 66,
                  },
                  exclude: ['transform-regenerator'],
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      ],
    },
  ]

  return defaultConfig
}
