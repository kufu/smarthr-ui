module.exports = {
  ...require('prettier-config-smarthr'),
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['tv'],
  tailwindConfig: './packages/smarthr-ui/tailwind.config.ts',
  overrides: [
    {
      files: 'packages/charts/**/*',
      options: {
        tailwindConfig: './packages/charts/tailwind.config.js',
      },
    },
  ],
}
