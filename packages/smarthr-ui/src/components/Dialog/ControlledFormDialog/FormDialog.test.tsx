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

describe('ControlledFormDialog の formProps', () => {
  type DialogProps = ComponentPropsWithRef<typeof ControlledFormDialog>

  const ActionFormDialog: FC<
    Partial<Pick<DialogProps, 'isOpen' | 'formProps' | 'onSubmit'>> & PropsWithChildren
  > = ({ isOpen = true, formProps, onSubmit, children }) => (
    <IntlProvider locale="ja">
      <ControlledFormDialog
        isOpen={isOpen}
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
    render(<ActionFormDialog formProps={{ action }} />)

    await clickSubmit()

    expect(action).toHaveBeenCalledTimes(1)
    expect((action.mock.calls[0][0] as FormData).get('name')).toBe('スマート 太郎')
  })

  it('formProps.onSubmit、onSubmit、action の順に呼ばれること', async () => {
    const calls: string[] = []
    render(
      <ActionFormDialog
        formProps={{
          action: () => {
            calls.push('action')
          },
          onSubmit: () => {
            calls.push('formProps.onSubmit')
          },
        }}
        onSubmit={() => {
          calls.push('onSubmit')
        }}
      />,
    )

    await clickSubmit()

    expect(calls).toEqual(['formProps.onSubmit', 'onSubmit', 'action'])
  })

  it('formProps.onSubmit で preventDefault すると、onSubmit と action が呼ばれないこと', async () => {
    const action = vi.fn()
    const onSubmit = vi.fn()
    render(
      <ActionFormDialog
        formProps={{ action, onSubmit: (e) => e.preventDefault() }}
        onSubmit={onSubmit}
      />,
    )

    await clickSubmit()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(action).not.toHaveBeenCalled()
  })

  it('action を渡した場合、onSubmit には preventDefault されていないイベントと close が渡されること', async () => {
    const onSubmit = vi.fn()
    render(<ActionFormDialog formProps={{ action: () => {} }} onSubmit={onSubmit} />)

    await clickSubmit()

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(false)
    expect(onSubmit.mock.calls[0][1].close).toBeInstanceOf(Function)
  })

  it('action を渡した場合、onSubmit で preventDefault すると action が呼ばれないこと', async () => {
    const action = vi.fn()
    render(<ActionFormDialog formProps={{ action }} onSubmit={(e) => e.preventDefault()} />)

    await clickSubmit()

    expect(action).not.toHaveBeenCalled()
  })

  it('action を渡さない場合は、onSubmit に preventDefault 済みのイベントと close が渡されること', async () => {
    const onSubmit = vi.fn()
    render(<ActionFormDialog formProps={{ noValidate: true }} onSubmit={onSubmit} />)

    await clickSubmit()

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit.mock.calls[0][0].defaultPrevented).toBe(true)
    expect(onSubmit.mock.calls[0][1].close).toBeInstanceOf(Function)
  })

  it('children 内の送信ボタンに formAction を渡すと、formProps.action が無くても FormData 付きで formAction が呼ばれること', async () => {
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
        <ActionFormDialog formProps={{ action }} />
      </form>,
    )

    await clickSubmit()

    expect(action).toHaveBeenCalledTimes(1)
    expect(parentSubmit).not.toHaveBeenCalled()
  })

  it('閉じている間に送信されると、formProps.onSubmit は呼ばれ、onSubmit と action は呼ばれないこと', async () => {
    const action = vi.fn()
    const formOnSubmit = vi.fn()
    const onSubmit = vi.fn()
    const { rerender } = render(
      <ActionFormDialog formProps={{ action, onSubmit: formOnSubmit }} onSubmit={onSubmit} />,
    )
    // HINT: 閉じるtransition中はformが描画されたままになるため、その間の送信を再現する
    const form = screen.getByRole('button', { name: '保存' }).closest('form')!
    rerender(
      <ActionFormDialog
        isOpen={false}
        formProps={{ action, onSubmit: formOnSubmit }}
        onSubmit={onSubmit}
      />,
    )

    await act(() => fireEvent.submit(form))

    expect(formOnSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(action).not.toHaveBeenCalled()
  })

  it('formProps の属性が form 要素に渡されること', () => {
    render(<ActionFormDialog formProps={{ action: () => {}, id: 'form-id', noValidate: true }} />)

    const form = screen.getByRole('button', { name: '保存' }).closest('form')!

    expect(form).toHaveAttribute('id', 'form-id')
    expect(form).toHaveAttribute('novalidate')
  })
})
