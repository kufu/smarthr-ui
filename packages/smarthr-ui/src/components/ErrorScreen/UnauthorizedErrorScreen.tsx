import { Button } from '../Button'
import { Center } from '../Layout'

import { ErrorScreen } from './ErrorScreen'

import type { FC } from 'react'

type Props = {
  onClickLogin: () => void
  isLoading: boolean
}

export const UnauthorizedErrorScreen: FC<Props> = ({ onClickLogin, isLoading }) => (
  <ErrorScreen title="一定時間操作がなかったためログアウトしました">
    <p>
      一定時間操作がなかったため、自動でログアウトしました。
      <br />
      指定のページにアクセスするには、再度ログインが必要です。
    </p>
    <Center>
      <Button className="shr-mt-1.5" onClick={onClickLogin} loading={isLoading}>
        再ログイン
      </Button>
    </Center>
  </ErrorScreen>
)
