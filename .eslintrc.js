module.exports = {
  extends: 'smarthr',
  rules: {
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',

    'smarthr/a11y-clickable-element-has-text': 'warn',
    'smarthr/a11y-image-has-alt-attribute': 'warn',
    'smarthr/a11y-trigger-has-button': 'warn',
    'smarthr/best-practice-for-date': 'warn',
    'smarthr/jsx-start-with-spread-attributes': [
      'warn',
      // {
      //   fix: true,
      // },
    ],
    'smarthr/prohibit-export-array-type': 'warn',
    'smarthr/require-barrel-import': 'warn',
  },
}
