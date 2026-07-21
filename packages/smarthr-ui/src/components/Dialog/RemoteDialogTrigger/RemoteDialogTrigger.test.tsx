import { act, render, screen } from '@testing-library/react'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'

import { MessageDialog } from './MessageDialog'
import { RemoteDialogTrigger } from './RemoteDialogTrigger'

describe('RemoteDialogTrigger', () => {
  it('Button が disabled のとき、クリックしてもダイアログが開かないこと', () => {
    render(
      <IntlProvider locale="ja">
        <RemoteDialogTrigger targetId="remote-dialog">
          <Button disabled>ダイアログを開く</Button>
        </RemoteDialogTrigger>
        <MessageDialog id="remote-dialog" heading="リモートダイアログ">
          ダイアログの内容
        </MessageDialog>
      </IntlProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: 'ダイアログを開く' }).click()
    })

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('Button が loading のとき、クリックしてもダイアログが開かないこと', () => {
    render(
      <IntlProvider locale="ja">
        <RemoteDialogTrigger targetId="remote-dialog">
          <Button loading>ダイアログを開く</Button>
        </RemoteDialogTrigger>
        <MessageDialog id="remote-dialog" heading="リモートダイアログ">
          ダイアログの内容
        </MessageDialog>
      </IntlProvider>,
    )

    act(() => {
      // loading 中は accessible name に「処理中」が付与されるため部分一致で取得する
      screen.getByRole('button', { name: /ダイアログを開く/ }).click()
    })

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('Button が enabled のとき、クリックするとダイアログが開くこと', () => {
    render(
      <IntlProvider locale="ja">
        <RemoteDialogTrigger targetId="remote-dialog">
          <Button>ダイアログを開く</Button>
        </RemoteDialogTrigger>
        <MessageDialog id="remote-dialog" heading="リモートダイアログ">
          ダイアログの内容
        </MessageDialog>
      </IntlProvider>,
    )

    act(() => {
      screen.getByRole('button', { name: 'ダイアログを開く' }).click()
    })

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
