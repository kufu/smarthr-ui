'use client'

import { Localizer } from '../../intl'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  smarthrUrl: string
}

export const AuthErrorScreen: FC<Props> = ({ smarthrUrl }) => (
  <ErrorScreen
    title={
      <Localizer id="smarthr-ui/AuthErrorScreen/title" defaultText="認証で問題が発生しました" />
    }
    links={[
      {
        label: <Localizer id="smarthr-ui/ErrorScreen/smarthrLink" defaultText="SmartHR に戻る" />,
        url: smarthrUrl,
      },
    ]}
  />
)
