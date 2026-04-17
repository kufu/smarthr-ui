import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  homeUrl: string
}

export const ForbiddenErrorScreen: FC<Props> = ({ homeUrl }) => (
  <ErrorScreen
    title="このページを表示する権限がありません"
    links={[
      {
        label: 'ホームへ戻る',
        url: homeUrl,
      },
    ]}
  >
    <p>詳しくは、所属企業の担当者にお問い合わせください。</p>
  </ErrorScreen>
)
