import smarthrConfig from 'oxlint-config-smarthr'

export default {
  extends: [smarthrConfig],
  ignorePatterns: [
    '.storybook/**',
    'dist/**',
    'coverage/**',
    'node_modules/**',
  ],
}
