import { Localizer } from '../../intl'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const ForbiddenErrorScreen: FC<Props> = ({ homeUrl }) => (
  <ErrorScreen
    links={[
      {
        label: <Localizer id="smarthr-ui/ErrorScreen/homeLink" defaultText="ホームに戻る" />,
        url: homeUrl,
      },
    ]}
    title={
      <Localizer
        id="smarthr-ui/ForbiddenErrorScreen/title"
        defaultText="このページを表示する権限がありません"
      />
    }
  >
    <p>
      <Localizer
        id="smarthr-ui/ForbiddenErrorScreen/description"
        defaultText="詳しくは、所属企業の担当者にお問い合わせください。"
      />
    </p>
  </ErrorScreen>
)
