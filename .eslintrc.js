module.exports = {
  extends: ['smarthr', 'plugin:storybook/recommended'],
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        controlComponents: ['Input', 'InputWithTooltip'],
      },
    ],
    '@typescript-eslint/consistent-type-definitions': [
      'error',
      'type',
    ],
    'smarthr/require-barrel-import': 'off',
    'smarthr/a11y-anchor-has-href-attribute': [
      'error',
      {
        checkType: 'allow-spread-attributes',
      }
    ],
    'smarthr/a11y-input-has-name-attribute': [
      'error',
      {
        checkType: 'allow-spread-attributes',
      }
    ],
  },
}
