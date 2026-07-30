'use client'

import { Localizer } from '../../intl'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const ForbiddenErrorScreen: FC<Props> = ({ homeUrl }) => (
  <ErrorScreen
    title={
      <Localizer
        id="smarthr-ui/ForbiddenErrorScreen/title"
        defaultText="このページを表示する権限がありません"
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
        id="smarthr-ui/ForbiddenErrorScreen/description"
        defaultText="詳しくは、所属企業の担当者にお問い合わせください。"
      />
    </p>
  </ErrorScreen>
)
