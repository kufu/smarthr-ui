module.exports = {
  stories: ['../**/*.stories.js'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        // we are not ready to use them yet.
        controls: false,
        docs: false
      }
    },
    '@storybook/addon-a11y',
    'storybook-readme'
  ]
}
