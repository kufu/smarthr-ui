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
  rules: {
    // TypeScript
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-import-type-side-effects': 'error',

    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Input', 'InputWithTooltip'],
      },
    ],
    'jsx-a11y/mouse-events-have-key-events': 'error',
    'jsx-a11y/no-noninteractive-element-interactions': 'error',
    'jsx-a11y/no-noninteractive-element-to-interactive-role': [
      'error',
      {
        menu: ['menu'],
      },
    ],
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',

    // React
    'react-hooks/exhaustive-deps': 'error',

    // SmartHR カスタムルール
    'smarthr/a11y-anchor-has-href-attribute': [
      'error',
      {
        checkType: 'allow-spread-attributes',
      },
    ],
    'smarthr/a11y-input-has-name-attribute': [
      'error',
      {
        checkType: 'allow-spread-attributes',
      },
    ],
    'smarthr/best-practice-for-prohibit-import-smarthr-ui-local': 'off',
    'smarthr/best-practice-for-rest-parameters': 'error',
    'smarthr/best-practice-for-unnesessary-early-return': 'error',

    // export * / import * 禁止
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ExportAllDeclaration',
        message: 'export * は使用できません。明示的なexportを使用してください。',
      },
      {
        selector: 'ExportNamedDeclaration[specifiers.0.type="ExportNamespaceSpecifier"]',
        message: 'export * as は使用できません。個別にimportしてオブジェクトを構築してください。',
      },
      {
        selector: 'ImportNamespaceSpecifier',
        message: 'import * as は使用できません。個別にimportしてください。',
      },
    ],
  },
}
