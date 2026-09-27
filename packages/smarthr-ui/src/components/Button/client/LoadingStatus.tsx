'use client'

import { memo } from 'react'

import { Portal } from '../../../hooks/client/usePortal'
import { Localizer } from '../../../intl'
import { LiveRegion } from '../../LiveRegion'

// `button` 要素内で live region を使うことはできないので、`role="status"` を持つ要素を外側に配置している。 https://github.com/kufu/smarthr-ui/pull/4558
// TODO: document.ariaNotifyで実装したい
// TODO: PortalのdivとLiveRegion内の要素が二重になっている。Portalのas propで統合する(別PRで対応)
export const LoadingStatus = memo<{ loading: boolean }>(({ loading }) => (
  <Portal>
    <LiveRegion visuallyHidden={true}>
      {loading && <Localizer id="smarthr-ui/Button/loading" defaultText="処理中" />}
    </LiveRegion>
  </Portal>
))
