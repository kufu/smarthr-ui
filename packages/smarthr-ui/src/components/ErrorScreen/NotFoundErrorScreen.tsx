'use client'

import { Localizer } from '../../intl'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const NotFoundErrorScreen: FC<Props> = ({ homeUrl }) => (
  <ErrorScreen
    title={
      <Localizer
        id="smarthr-ui/NotFoundErrorScreen/title"
        defaultText="お探しのページは見つかりませんでした"
      />
    }
    links={[
      {
        label: <Localizer id="smarthr-ui/ErrorScreen/homeLink" defaultText="ホームに戻る" />,
        url: homeUrl,
      },
    ]}
  >
    <p>
      <Localizer
        id="smarthr-ui/NotFoundErrorScreen/description"
        defaultText="お探しのページは一時的にアクセスができない状況にあるか、移動もしくは削除された可能性があります。"
      />
    </p>
  </ErrorScreen>
)
