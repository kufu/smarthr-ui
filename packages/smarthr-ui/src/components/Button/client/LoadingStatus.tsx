'use client'

import { memo } from 'react'

import { usePortal } from '../../../hooks/client/usePortal'
import { Localizer } from '../../../intl'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'

export const LoadingStatus = memo<{ loading: boolean; buttonId: string }>(
  ({ loading, buttonId }) => {
    const { createPortal } = usePortal()

    // `button` 要素内で live region を使うことはできないので、`role="status"` を持つ要素を外側に配置している。 https://github.com/kufu/smarthr-ui/pull/4558
    return createPortal(
      <VisuallyHiddenText as="output" role="status" htmlFor={buttonId}>
        {loading && <Localizer id="smarthr-ui/Button/loading" defaultText="処理中" />}
      </VisuallyHiddenText>,
    )
  },
)
