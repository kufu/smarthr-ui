'use client'

import { useIntl } from '../../intl'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const ForbiddenErrorScreen: FC<Props> = ({ homeUrl }) => {
  const { localize } = useIntl()

  return (
    <ErrorScreen
      title={localize({
        id: 'smarthr-ui/ForbiddenErrorScreen/title',
        defaultText: 'このページを表示する権限がありません',
      })}
      links={[
        {
          label: localize({
            id: 'smarthr-ui/ErrorScreen/homeLink',
            defaultText: 'ホームに戻る',
          }),
          url: homeUrl,
        },
      ]}
    >
      <p>
        {localize({
          id: 'smarthr-ui/ForbiddenErrorScreen/description',
          defaultText: '詳しくは、所属企業の担当者にお問い合わせください。',
        })}
      </p>
    </ErrorScreen>
  )
}
