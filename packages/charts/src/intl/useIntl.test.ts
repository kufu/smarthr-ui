import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { IntlProvider } from 'react-intl'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getIntl, useIntl } from './useIntl'

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
})

describe('useIntl', () => {
  const Label = () => {
    const { localize: localizeLabel, locale } = useIntl()

    return `${locale}:${localizeLabel(
      {
        id: 'smarthr-ui-charts/DoughnutChart/ariaLabel',
        defaultText: 'ドーナツグラフ {segmentCount}個の項目',
      },
      { segmentCount: 4 },
    )}`
  }

  // smarthr-uiのIntlProviderを通さず、react-intlのIntlProviderを直接使うプロダクトを想定する
  const render = (locale: string, messages?: Record<string, string>) =>
    renderToStaticMarkup(
      createElement(IntlProvider, { locale, messages, onError: () => {} }, createElement(Label)),
    )

  it('プロトタイプ上のキーと同名のロケールはjaとして扱う', () => {
    expect(render('toString')).toBe('ja:ドーナツグラフ 4個の項目')
  })

  it.each(['ja', 'en-us'])(
    'プロダクト側のmessagesに同名のキーがあっても、chartsの文言を使う（%s）',
    (locale) => {
      expect(
        render(locale, { 'smarthr-ui-charts/DoughnutChart/ariaLabel': 'プロダクト側の文言' }),
      ).toBe(`${locale}:ドーナツグラフ 4個の項目`)
    },
  )
})
