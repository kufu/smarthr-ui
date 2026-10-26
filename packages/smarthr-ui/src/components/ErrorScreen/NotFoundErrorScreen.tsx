import { Localizer } from '../../intl'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const NotFoundErrorScreen: FC<Props> = ({ homeUrl }) => (
  <ErrorScreen
    links={[
      {
        label: <Localizer id="smarthr-ui/ErrorScreen/homeLink" defaultText="ホームに戻る" />,
        url: homeUrl,
      },
    ]}
    title={
      <Localizer
        id="smarthr-ui/NotFoundErrorScreen/title"
        defaultText="お探しのページは見つかりませんでした"
      />
    }
  >
    <p>
      <Localizer
        id="smarthr-ui/NotFoundErrorScreen/description"
        defaultText="お探しのページは一時的にアクセスができない状況にあるか、移動もしくは削除された可能性があります。"
      />
    </p>
  </ErrorScreen>
)
