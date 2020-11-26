module.exports = {
  stories: ['../**/*.stories.tsx', '../**/*.stories.mdx'],
  addons: [
    'storybook-readme',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-storysource',
      options: {
        parser: 'typescript'
      }
    },
    '@storybook/addon-a11y'
  ]
}
