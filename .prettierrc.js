module.exports = {
  ...require('prettier-config-smarthr'),
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['tv'],
  tailwindConfig: './packages/smarthr-ui/tailwind.config.ts',
  overrides: [
    {
      files: 'packages/rich-text-editor/**',
      options: { tailwindConfig: './packages/rich-text-editor/tailwind.config.js' },
    },
  ],
}
