// .storybook/test-runner.js

const { injectAxe, checkA11y } = require('axe-playwright')

module.exports = {
  async preRender(page, context) {
    await injectAxe(page)
  },
  async postRender(page, context) {
    await checkA11y(page, '#root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })
  },
}
