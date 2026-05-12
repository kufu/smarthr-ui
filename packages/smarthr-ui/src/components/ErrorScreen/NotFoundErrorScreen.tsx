'use client'

import { useIntl } from '../../intl'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const NotFoundErrorScreen: FC<Props> = ({ homeUrl }) => {
  const { localize } = useIntl()

  return (
    <ErrorScreen
      title={localize({
        id: 'smarthr-ui/NotFoundErrorScreen/title',
        defaultText: 'お探しのページは見つかりませんでした',
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
          id: 'smarthr-ui/NotFoundErrorScreen/description',
          defaultText:
            'お探しのページは一時的にアクセスができない状況にあるか、移動もしくは削除された可能性があります。',
        })}
      </p>
    </ErrorScreen>
  )
}
