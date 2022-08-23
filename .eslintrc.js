module.exports = {
  extends: 'smarthr',
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',

    'smarthr/a11y-clickable-element-has-text': 'error',
    'smarthr/a11y-image-has-alt-attribute': 'error',
    'smarthr/a11y-trigger-has-button': 'error',
    'smarthr/best-practice-for-date': 'error',
    'smarthr/jsx-start-with-spread-attributes': [
      'error',
      {
        fix: true,
      },
    ],
    'smarthr/prohibit-export-array-type': 'error',
    'smarthr/require-barrel-import': 'error',
  },
}
