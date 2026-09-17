import { afterEach, describe, expect, it, vi } from 'vitest'

import { getIntl } from './useIntl'

import type { locales } from './locales'

const localize = (
  locale: keyof typeof locales,
  id: string,
  defaultMessage: string,
  values: Record<string, string | number>,
) => getIntl(locale).formatMessage({ id, defaultMessage }, values)

describe('getIntl', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('翻訳が存在しないロケールでは、defaultTextにフォールバックしconsole.errorを呼ばない', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(
      localize(
        'en-us',
        'smarthr-ui-charts/DoughnutChart/ariaLabel',
        'ドーナツグラフ {segmentCount}個の項目',
        { segmentCount: 4 },
      ),
    ).toBe('ドーナツグラフ 4個の項目')
    expect(spy).not.toHaveBeenCalled()
  })

  describe('プロダクト側のmessagesとのマージ', () => {
    it('プロダクト側のキーを引ける', () => {
      const intl = getIntl('ja', { 'product/foo': 'プロダクトの文言' })

      expect(intl.formatMessage({ id: 'product/foo' })).toBe('プロダクトの文言')
    })

    it('chartsのキーはプロダクト側に上書きされない', () => {
      // smarthr-uiのIntlProviderと同様、自身の辞書を後に展開している
      const intl = getIntl('ja', {
        'smarthr-ui-charts/DoughnutChart/ariaLabel': '上書きされるべきではない文言',
      })

      expect(
        intl.formatMessage(
          {
            id: 'smarthr-ui-charts/DoughnutChart/ariaLabel',
            defaultMessage: 'ドーナツグラフ {segmentCount}個の項目',
          },
          { segmentCount: 4 },
        ),
      ).toBe('ドーナツグラフ 4個の項目')
    })
  })
})
