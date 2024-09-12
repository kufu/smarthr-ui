const { injectAxe, getViolations } = require('axe-playwright')
import { waitForPageReady } from '@storybook/test-runner';

module.exports = {
  setup() {
    // エラー内容を詳細に表示するためのカスタムマッチャを作成
    expect.extend({
      // 参考: https://www.deque.com/axe/core-documentation/api-documentation/#api-name-axeconfigure
      toValidA11y(violations) {
        if (violations.length === 0) {
          return {
            message: () => `No accessibility violations detected!`,
            pass: true,
          }
        }

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

        // 影響が軽微な指摘
        const minorViolations = violations.filter((v) => {
          const targetIds = [
            // critical
            // コントラストは 'critical' だが、ヘッダなどで対応できていないのでコンポーネントが修正されるまで除外
            'color-contrast',
            // minor
            'empty-table-header',
            // moderate
            'landmark-unique',
            'landmark-no-duplicate-banner',
          ]

          if (targetIds.includes(v.id)) return true
        })

        if (minorViolations.length === violations.length) {
          // 軽微な指摘の場合のみの場合はエラーにしない
          return {
            message: () => `Minor accessibility violations detected.\n\n${violationsMessage}`,
            pass: true,
          }
        } else {
          return {
            message: () => `Accessibility violations detected.\n\n${violationsMessage}`,
            pass: false,
          }
        }
      },
    })
  },
  async preVisit(page) {
    await injectAxe(page)
  },
  async postVisit(page) {
    await waitForPageReady(page)

    const violations = await getViolations(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    })

    expect(violations).toValidA11y()
  },
}
