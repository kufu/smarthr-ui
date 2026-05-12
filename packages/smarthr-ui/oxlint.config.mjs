export default {
  extends: ['oxlint-config-smarthr'],
  jsPlugins: ['eslint-plugin-smarthr'],
  ignorePatterns: [
    // NOTE: storiesやtestファイルにもlintを適用するため、パターンでの除外は行わない
    // 特定のファイルで問題が発生する場合は、そのファイルに直接ignore commentを追加する
    '.storybook/**',
    'dist/**',
    'coverage/**',
    'node_modules/**',
  ],
}
