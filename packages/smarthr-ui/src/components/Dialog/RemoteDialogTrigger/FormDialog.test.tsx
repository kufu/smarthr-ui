import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, useState } from 'react'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'
import { Input } from '../../Input'

import { FormDialog } from './FormDialog'
import { RemoteDialogTrigger } from './RemoteDialogTrigger'

// HINT: useRemoteTrigger内部でrequestAnimationFrame経由で遅延実行されるonOpen/onCloseを待つ。
// actでラップしないと、フレーム内でのstate更新がテスト側に反映されるタイミングが保証されない
const waitForAnimationFrame = () =>
  act(() => new Promise((resolve) => requestAnimationFrame(resolve)))

type Item = { id: string; title: string }

const ITEMS: Item[] = [
  { id: '1', title: 'テンプレートA' },
  { id: '2', title: 'テンプレートB' },
]

// HINT: 「一覧の各行のボタンから共通のダイアログを開き、onOpenでクリックした行の値を初期値にする」
// という利用方法の回帰を検知するための再現コード
const TargetDialog: FC<{ selected?: Item }> = ({ selected }) => {
  const [value, setValue] = useState('')

  return (
    <FormDialog
      id="repro-dialog"
      heading="複製"
      actionButton={{ text: '複製', theme: 'primary' }}
      onOpen={() => setValue(selected ? `（コピー）${selected.title}` : '')}
      onClose={() => setValue('')}
      onSubmit={async (_e, { close }) => close()}
    >
      <Input
        name="title"
        aria-label="テンプレート名"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </FormDialog>
  )
}

const Page: FC = () => {
  const [selected, setSelected] = useState<Item | undefined>(undefined)

  return (
    <IntlProvider locale="ja">
      {ITEMS.map((item) => (
        <RemoteDialogTrigger
          key={item.id}
          targetId="repro-dialog"
          onClick={(open) => {
            // クリックされた行を確定してから開く
            setSelected(item)
            open()
          }}
        >
          <Button>{item.title}を複製</Button>
        </RemoteDialogTrigger>
      ))}
      <TargetDialog selected={selected} />
    </IntlProvider>
  )
}

describe('FormDialog（RemoteDialogTrigger経由）のonOpenが参照するprops', () => {
  it('初回に開いたときも、クリックした行の値で初期化される', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByRole('button', { name: 'テンプレートAを複製' }))
    await waitForAnimationFrame()

    expect(screen.getByLabelText('テンプレート名')).toHaveValue('（コピー）テンプレートA')
  })

  it('閉じた直後に間を空けず別の行を開いても、前に開いた行の値が残らない', async () => {
    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByRole('button', { name: 'テンプレートAを複製' }))
    await waitForAnimationFrame()

    // HINT: キャンセルで閉じた直後（フレームが経過する前）に別の行を開いても、
    // onCloseではなく最新のonOpenが正しく反映されることを確認する
    await user.click(screen.getByRole('button', { name: 'キャンセル' }))
    await user.click(screen.getByRole('button', { name: 'テンプレートBを複製' }))
    await waitForAnimationFrame()

    expect(screen.getByLabelText('テンプレート名')).toHaveValue('（コピー）テンプレートB')
  })
})
