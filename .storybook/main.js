module.exports = {
  stories: ['../**/*.stories.js'],
  addons: [
    'storybook-readme',
    {
      name: '@storybook/addon-essentials',
      options: {
        // we are not ready to use them yet.
        controls: false,
        docs: false
      }
    },
    {
      name: '@storybook/addon-storysource',
      options: {
        parser: 'typescript'
      }
    },
    '@storybook/addon-a11y'
  ]
}
