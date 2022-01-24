module.exports = {
  presets: ['@acot/wcag'],
  extends: ['preset:@acot/wcag/recommended'],
  connection: {
    command: 'yarn http-server storybook-static/ -p 6006',
    timeout: 1200000,
  },
  rules: {
    '@acot/wcag/focusable-has-indicator': 'off',
    '@acot/wcag/page-has-title': 'off',
    '@acot/wcag/page-has-valid-lang': 'off',
    '@acot/wcag/interactive-has-enough-size': 'off',
    '@acot/wcag/interactive-supports-focus': 'warn',
  },
  paths: ['/iframe.html?id=dialog--default&args=&viewMode=story'],
  origin: 'http://localhost:6006',
  reporters: ['@acot/github'],
}
