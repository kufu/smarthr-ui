module.exports = {
  stories: ['../**/*.stories.tsx'],
  addons: [
    'storybook-readme',
    {
      name: '@storybook/addon-essentials',
    },
    '@storybook/addon-a11y',
    '@storybook/addon-controls',
    'storycap',
  ],
}
