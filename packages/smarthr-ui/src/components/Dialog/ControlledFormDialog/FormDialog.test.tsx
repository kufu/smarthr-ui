import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  type ComponentPropsWithRef,
  type FC,
  type PropsWithChildren,
  useRef,
  useState,
} from 'react'

import { IntlProvider } from '../../../intl'
import { Button } from '../../Button'
import { FormControl } from '../../FormGroup'
import { Input } from '../../Input'

import { ControlledFormDialog } from './ControlledFormDialog'

const waitForAnimationFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

describe('ControlledFormDialog', () => {
  const DialogTemplate: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>ControlledFormDialog</Button>
        <ControlledFormDialog
          isOpen={isOpen}
          onSubmit={(_, { close }) => {
            close()
          }}
          onClickClose={() => {
            setIsOpen(false)
          }}
          heading="ControlledFormDialog"
          actionButton="保存"
        >
          ダイアログの中身です
        </ControlledFormDialog>
      </IntlProvider>
    )
  }
  it('ダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'ControlledFormDialog' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')
    expect(screen.getByRole('dialog', { name: 'ControlledFormDialog' })).toBeVisible()

    // FocusTrap はカスケード更新完了後の requestAnimationFrame でフォーカスするため、フレームが進むのを待つ
    await waitForAnimationFrame()

    await userEvent.tab({ shift: true })
    await userEvent.keyboard('{ }')
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'ControlledFormDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'ControlledFormDialog' })).toHaveFocus()
  })

  const DialogTemplateWithFocusTrap: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const openedFocusRef = useRef<HTMLInputElement>(null)
    return (
      <IntlProvider locale="ja">
        <Button onClick={() => setIsOpen(true)}>開いた状態で DOM に投入</Button>
        {isOpen && (
          <ControlledFormDialog
            isOpen
            firstFocusTarget={openedFocusRef}
            onSubmit={(_, { close }) => {
              close()
            }}
            onClickClose={() => {
              setIsOpen(false)
            }}
            heading="開いた状態で投入されたダイアログ"
            actionButton="実行"
          >
            <FormControl
              label={
                <>
                  <code>isOpen=true</code> の状態で DOM に投入した場合のダイアログ
                </>
              }
            >
              <Input ref={openedFocusRef} name="opened_dialog_focus_target" />
            </FormControl>
          </ControlledFormDialog>
        )}
      </IntlProvider>
    )
  }
  it('開いた状態で DOM に投入されたダイアログにフォーカスが移動すること', async () => {
    render(<DialogTemplateWithFocusTrap />)

    expect(screen.queryByRole('dialog', { name: '開いた状態で投入されたダイアログ' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')
    expect(screen.getByRole('dialog', { name: '開いた状態で投入されたダイアログ' })).toBeVisible()

    // FocusTrap はカスケード更新完了後の requestAnimationFrame でフォーカスするため、フレームが進むのを待つ
    await waitForAnimationFrame()

    expect(
      screen.getByRole('textbox', { name: 'isOpen=true の状態で DOM に投入した場合のダイアログ' }),
    ).toHaveFocus()

    await userEvent.tab()
    await userEvent.keyboard('{ }')
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'ControlledFormDialog' })).toBeNull()
      },
      { timeout: 1000 },
    )

    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: '開いた状態で DOM に投入' })).toHaveFocus()
  })

  it('閉じるボタンのクリックでonClickCloseに実際のMouseEventが渡されること', async () => {
    const handleClickClose = vi.fn()
    render(
      <IntlProvider locale="ja">
        <ControlledFormDialog
          isOpen
          onSubmit={(_, { close }) => close()}
          onClickClose={handleClickClose}
          heading="ControlledFormDialog"
          actionButton="保存"
        >
          ダイアログの中身です
        </ControlledFormDialog>
      </IntlProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    expect(handleClickClose).toHaveBeenCalledTimes(1)
    expect(handleClickClose.mock.calls[0][0].nativeEvent).toBeInstanceOf(MouseEvent)
  })

  it('Escapeキー押下でonClickCloseに実際のKeyboardEventが渡されること', async () => {
    const handleClickClose = vi.fn()
    render(
      <IntlProvider locale="ja">
        <ControlledFormDialog
          isOpen
          onSubmit={(_, { close }) => close()}
          onClickClose={handleClickClose}
          heading="ControlledFormDialog"
          actionButton="保存"
        >
          ダイアログの中身です
        </ControlledFormDialog>
      </IntlProvider>,
    )

    await userEvent.keyboard('{Escape}')

    expect(handleClickClose).toHaveBeenCalledTimes(1)
    const receivedEvent = handleClickClose.mock.calls[0][0]
    expect(receivedEvent).toBeInstanceOf(KeyboardEvent)
    expect(receivedEvent.key).toBe('Escape')
  })
})

describe('ControlledFormDialog の action', () => {
  type DialogProps = ComponentPropsWithRef<typeof ControlledFormDialog>

  const ActionFormDialog: FC<
    Partial<Pick<DialogProps, 'isOpen' | 'action' | 'formProps' | 'onSubmit'>> & PropsWithChildren
  > = ({ isOpen = true, action, formProps, onSubmit, children }) => (
    <IntlProvider locale="ja">
      <ControlledFormDialog
        isOpen={isOpen}
        action={action}
        formProps={formProps}
        onSubmit={onSubmit}
        onClickClose={() => {}}
        heading="ControlledFormDialog"
        actionButton="保存"
      >
        <FormControl label="名前">
          <Input name="name" defaultValue="スマート 太郎" />
        </FormControl>
        {children}
      </ControlledFormDialog>
    </IntlProvider>
  )

  const clickSubmit = () => act(() => userEvent.click(screen.getByRole('button', { name: '保存' })))

  it('action を渡すと、送信時にフォームの値を含む FormData で action が呼ばれること', async () => {
    const action = vi.fn()
    render(<ActionFormDialog action={action} />)

    await clickSubmit()

    expect(action).toHaveBeenCalledTimes(1)
    expect((action.mock.calls[0][0] as FormData).get('name')).toBe('スマート 太郎')
  })

  it('onSubmit、action の順に呼ばれること', async () => {
    const calls: string[] = []
    render(
      <ActionFormDialog
        action={() => {
          calls.push('action')
        }}
        onSubmit={() => {
          calls.push('onSubmit')
        }}
      />,
    )

    await clickSubmit()

    expect(calls).toEqual(['onSubmit', 'action'])
  })

  it('action を渡した場合、onSubmit には preventDefault されていないイベントと close が渡されること', async () => {
    const onSubmit = vi.fn()
    render(<ActionFormDialog action={() => {}} onSubmit={onSubmit} />)

    await clickSubmit()

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(false)
    expect(onSubmit.mock.calls[0][1].close).toBeInstanceOf(Function)
  })

  it('action を渡した場合、onSubmit で preventDefault すると action が呼ばれないこと', async () => {
    const action = vi.fn()
    render(<ActionFormDialog action={action} onSubmit={(e) => e.preventDefault()} />)

    await clickSubmit()

    expect(action).not.toHaveBeenCalled()
  })

  it('action に空文字を渡した場合も、onSubmit に preventDefault されていないイベントが渡されること', async () => {
    let defaultPrevented: boolean | undefined
    render(
      <ActionFormDialog
        action=""
        onSubmit={(e) => {
          defaultPrevented = e.defaultPrevented
          // HINT: jsdomはページ遷移を伴うフォーム送信を実装していないため止める
          e.preventDefault()
        }}
      />,
    )

    await clickSubmit()

    expect(defaultPrevented).toBe(false)
  })

  it('action を渡さない場合は、onSubmit に preventDefault 済みのイベントと close が渡されること', async () => {
    const onSubmit = vi.fn()
    render(<ActionFormDialog formProps={{ noValidate: true }} onSubmit={onSubmit} />)

    await clickSubmit()

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true)
    expect(onSubmit.mock.calls[0][1].close).toBeInstanceOf(Function)
  })

  it('children 内の送信ボタンに formAction を渡すと、action が無くても FormData 付きで formAction が呼ばれること', async () => {
    const saveDraft = vi.fn()
    const onSubmit = vi.fn()
    render(
      <ActionFormDialog onSubmit={onSubmit}>
        <Button type="submit" formAction={saveDraft}>
          下書き保存
        </Button>
      </ActionFormDialog>,
    )

    await act(() => userEvent.click(screen.getByRole('button', { name: '下書き保存' })))

    expect(saveDraft).toHaveBeenCalledTimes(1)
    expect((saveDraft.mock.calls[0][0] as FormData).get('name')).toBe('スマート 太郎')
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(false)
  })

  it('subActionArea の送信ボタンに formAction を渡すと、FormData 付きで formAction が呼ばれること', async () => {
    const saveDraft = vi.fn()
    render(
      <IntlProvider locale="ja">
        <ControlledFormDialog
          isOpen
          onSubmit={() => {}}
          onClickClose={() => {}}
          heading="ControlledFormDialog"
          actionButton="保存"
          subActionArea={
            <Button type="submit" formAction={saveDraft}>
              下書き保存
            </Button>
          }
        >
          <FormControl label="名前">
            <Input name="name" defaultValue="スマート 太郎" />
          </FormControl>
        </ControlledFormDialog>
      </IntlProvider>,
    )

    await act(() => userEvent.click(screen.getByRole('button', { name: '下書き保存' })))

    expect(saveDraft).toHaveBeenCalledTimes(1)
    expect((saveDraft.mock.calls[0][0] as FormData).get('name')).toBe('スマート 太郎')
  })

  it('children 内の送信ボタンに formAction があっても、formAction の無いボタンでの送信では onSubmit に preventDefault 済みのイベントが渡されること', async () => {
    const saveDraft = vi.fn()
    const onSubmit = vi.fn()
    render(
      <ActionFormDialog onSubmit={onSubmit}>
        <Button type="submit" formAction={saveDraft}>
          下書き保存
        </Button>
      </ActionFormDialog>,
    )

    await clickSubmit()

    expect(saveDraft).not.toHaveBeenCalled()
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true)
  })

  it('Portal 越しの親 form の onSubmit が preventDefault していても action が呼ばれ、親の onSubmit は呼ばれないこと', async () => {
    const action = vi.fn()
    const parentSubmit = vi.fn((e) => e.preventDefault())
    render(
      <form onSubmit={parentSubmit}>
        <ActionFormDialog action={action} />
      </form>,
    )

    await clickSubmit()

    expect(action).toHaveBeenCalledTimes(1)
    expect(parentSubmit).not.toHaveBeenCalled()
  })

  it('action を渡した場合、閉じている間に送信されると onSubmit は呼ばれ、action は呼ばれないこと', async () => {
    const action = vi.fn()
    const onSubmit = vi.fn()
    const { rerender } = render(<ActionFormDialog action={action} onSubmit={onSubmit} />)
    // HINT: 閉じるtransition中はformが描画されたままになるため、その間の送信を再現する
    const form = screen.getByRole('button', { name: '保存' }).closest('form')!
    rerender(<ActionFormDialog isOpen={false} action={action} onSubmit={onSubmit} />)

    await act(() => fireEvent.submit(form))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(action).not.toHaveBeenCalled()
  })

  it('action を渡さない場合、閉じている間に送信されても onSubmit は呼ばれないこと', async () => {
    const onSubmit = vi.fn()
    const { rerender } = render(<ActionFormDialog onSubmit={onSubmit} />)
    const form = screen.getByRole('button', { name: '保存' }).closest('form')!
    rerender(<ActionFormDialog isOpen={false} onSubmit={onSubmit} />)

    await act(() => fireEvent.submit(form))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('formProps の属性が form 要素に渡されること', () => {
    render(<ActionFormDialog action={() => {}} formProps={{ id: 'form-id', noValidate: true }} />)

    const form = screen.getByRole('button', { name: '保存' }).closest('form')!

    expect(form).toHaveAttribute('id', 'form-id')
    expect(form).toHaveAttribute('novalidate')
  })

  it('formProps に onSubmit を含むオブジェクトは型エラーになること', () => {
    const formProps = { id: 'form-id', onSubmit: () => {} }

    // @ts-expect-error onSubmit は formProps ではなく onSubmit props で渡す
    render(<ActionFormDialog formProps={formProps} />)
  })
})
