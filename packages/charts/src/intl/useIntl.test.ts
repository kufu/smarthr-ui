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

  // i18n対応前の実装と1文字も変わらないことを担保する
  it.each([
    [
      'smarthr-ui-charts/BarChart/ariaLabel',
      '棒グラフ {datasetCount}個のデータ {barCount}本の棒',
      { datasetCount: 3, barCount: 12 },
      '棒グラフ 3個のデータ 12本の棒',
    ],
    [
      'smarthr-ui-charts/BarChart/ariaLabelWithTitle',
      '{title} 棒グラフ {datasetCount}個のデータ {barCount}本の棒',
      { title: '雇用形態の内訳', datasetCount: 3, barCount: 12 },
      '雇用形態の内訳 棒グラフ 3個のデータ 12本の棒',
    ],
    [
      'smarthr-ui-charts/LineChart/ariaLabel',
      '線グラフ {datasetCount}個のデータ {pointCount}個のポイント',
      { datasetCount: 2, pointCount: 7 },
      '線グラフ 2個のデータ 7個のポイント',
    ],
    [
      'smarthr-ui-charts/LineChart/ariaLabelWithTitle',
      '{title} 線グラフ {datasetCount}個のデータ {pointCount}個のポイント',
      { title: '月別推移', datasetCount: 2, pointCount: 7 },
      '月別推移 線グラフ 2個のデータ 7個のポイント',
    ],
    [
      'smarthr-ui-charts/RadarChart/ariaLabel',
      'レーダーチャート {datasetCount}個のデータ {axisCount}個の軸',
      { datasetCount: 1, axisCount: 5 },
      'レーダーチャート 1個のデータ 5個の軸',
    ],
    [
      'smarthr-ui-charts/RadarChart/ariaLabelWithTitle',
      '{title} レーダーチャート {datasetCount}個のデータ {axisCount}個の軸',
      { title: '能力評価', datasetCount: 1, axisCount: 5 },
      '能力評価 レーダーチャート 1個のデータ 5個の軸',
    ],
    [
      'smarthr-ui-charts/DoughnutChart/ariaLabel',
      'ドーナツグラフ {segmentCount}個の項目',
      { segmentCount: 4 },
      'ドーナツグラフ 4個の項目',
    ],
    [
      'smarthr-ui-charts/DoughnutChart/ariaLabelWithTitle',
      '{title} ドーナツグラフ {segmentCount}個の項目',
      { title: '雇用形態の内訳', segmentCount: 4 },
      '雇用形態の内訳 ドーナツグラフ 4個の項目',
    ],
  ] as const)(
    'jaロケールでは %s がi18n対応前と同じ文字列になる',
    (id, defaultText, values, expected) => {
      expect(localize('ja', id, defaultText, values)).toBe(expected)
    },
  )

  it('数値は桁区切りされない', () => {
    expect(
      localize(
        'ja',
        'smarthr-ui-charts/DoughnutChart/ariaLabel',
        'ドーナツグラフ {segmentCount}個の項目',
        { segmentCount: 12345 },
      ),
    ).toBe('ドーナツグラフ 12345個の項目')
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
