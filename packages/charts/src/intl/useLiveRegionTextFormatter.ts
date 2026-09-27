'use client'

import { useCallback } from 'react'

import { useIntl } from './useIntl'

import type { LiveRegionTextParts } from '../plugins'

/**
 * キーボードナビゲーション時にライブリージョンへ書き込む文言を組み立てるフック
 */
export const useLiveRegionTextFormatter = () => {
  const { localize } = useIntl()

  return useCallback(
    ({ datasetLabel, label, value }: LiveRegionTextParts) =>
      localize(
        {
          id: 'smarthr-ui-charts/keyboardNavigation/liveRegionText',
          defaultText: '{datasetLabel} {label} {value}',
        },
        { datasetLabel, label, value },
      )
        // 系列名や項目名を持たないチャートでは空文字が渡るため、余分な空白を取り除く
        .replace(/\s+/g, ' ')
        .trim(),
    [localize],
  )
}
