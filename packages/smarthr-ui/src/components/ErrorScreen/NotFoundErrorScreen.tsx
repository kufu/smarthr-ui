import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const NotFoundErrorScreen: FC<Props> = ({ homeUrl }) => (
  <ErrorScreen
    title="お探しのページは見つかりませんでした"
    links={[
      {
        label: 'ホームへ戻る',
        url: homeUrl,
      },
    ]}
  >
    <p>
      お探しのページは一時的にアクセスができない状況にあるか、移動もしくは削除された可能性があります。
    </p>
  </ErrorScreen>
)
