module.exports = {
  ...require('prettier-config-smarthr'),
  printWidth: 100,
  plugins: [require('prettier-plugin-tailwindcss')],
  tailwindFunctions: ['tv'],
}
