import smarthrConfig from 'oxlint-config-smarthr'

export default {
  extends: [smarthrConfig],
  ignorePatterns: [
    // NOTE: storiesやtestファイルにもlintを適用するため、パターンでの除外は行わない
    // 特定のファイルで問題が発生する場合は、そのファイルに直接ignore commentを追加する
    '.storybook/**',
    'dist/**',
    'coverage/**',
    'node_modules/**',
  ],
}
