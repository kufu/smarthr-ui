module.exports = {
  ...require('prettier-config-smarthr'),
  printWidth: 100,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['tv'],
}
