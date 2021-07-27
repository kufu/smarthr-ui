module.exports = {
  stories: ['../**/*.stories.tsx'],
  addons: [
    'storybook-readme',
    {
      name: '@storybook/addon-essentials',
      options: {
        controls: false,
      },
    },
    '@storybook/addon-a11y',
  ],
}
