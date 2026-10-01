import { memo } from 'react'

import { Localizer } from '../../intl'
import { LiveRegion } from '../LiveRegion'
import { Portal } from '../Portal'

// `button` 要素内で live region を使うことはできないので、`role="status"` を持つ要素を外側に配置している。 https://github.com/kufu/smarthr-ui/pull/4558
export const LoadingStatus = memo<{ loading: boolean }>(({ loading }) => (
  <Portal>
    <LiveRegion visuallyHidden={true}>
      {loading && <Localizer id="smarthr-ui/Button/loading" defaultText="処理中" />}
    </LiveRegion>
  </Portal>
))
