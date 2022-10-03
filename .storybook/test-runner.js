const { injectAxe, getViolations } = require('axe-playwright')

// エラー内容を詳細に表示するためのカスタムマッチャを作成
expect.extend({
  toValidA11y(violations) {
    if (violations.length > 0) {
      const violationsMessage = JSON.stringify(
        violations.map(({ id, impact, description, help }) => ({
          id,
          impact,
          description,
          help,
        })),
        '\n',
        '  ',
      )

      return {
        message: () => `Accessibility violations detected.\n\n${violationsMessage}`,
        pass: false,
      }
    } else {
      return {
        message: () => `No accessibility violations detected!`,
        pass: true,
      }
    }
  },
})

module.exports = {
  async preRender(page) {
    await injectAxe(page)
  },
  async postRender(page) {
    const violations = await getViolations(page, '#root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })

    expect(violations).toValidA11y()
  },
}
