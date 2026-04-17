import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  smarthrUrl: string
}

export const AuthErrorScreen: FC<Props> = ({ smarthrUrl }) => (
  <ErrorScreen
    title="認証で問題が発生しました"
    links={[
      {
        label: 'ホームへ戻る',
        url: smarthrUrl,
      },
    ]}
  />
)
