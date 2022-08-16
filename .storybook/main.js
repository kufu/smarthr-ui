module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    {
      name: '@storybook/addon-essentials',
    },
    '@storybook/addon-a11y',
    '@storybook/addon-controls',
    'storycap',
    '@storybook/addon-interactions',
  ],
}
