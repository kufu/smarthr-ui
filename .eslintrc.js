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
    'smarthr/a11y-anchor-has-href-attribute': 'error',
    'smarthr/a11y-prohibit-input-placeholder': 'error',
    'smarthr/require-barrel-import': 0,
  },
}
