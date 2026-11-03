import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { type FC, type ReactElement, useState } from 'react'

import { IntlProvider } from '../../intl'
import { Button } from '../Button'
import { FormControl } from '../FormGroup'
import { Heading } from '../Heading'
import { Input } from '../Input'
import { Section } from '../SectioningContent'

import { DrawerBody } from './DrawerBody'
import { DrawerFooter } from './DrawerFooter'
import { InlineDrawerLayout } from './InlineDrawerLayout'
import { DrawerHeader, InlineDrawer } from './client'

import type { InlineDrawerSize } from './drawerSize'

const PANEL_ID = 'filter-panel'

const renderWithIntl = (ui: ReactElement) => render(<IntlProvider locale="ja">{ui}</IntlProvider>)

const Template: FC<{
  initialOpen?: boolean
  size?: InlineDrawerSize
  onClickClose?: () => void
}> = ({ initialOpen = false, size, onClickClose }) => {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const close = () => {
    onClickClose?.()
    setIsOpen(false)
  }

  return (
    <InlineDrawerLayout
      left={
        <InlineDrawer id={PANEL_ID} isOpen={isOpen} size={size} onClickClose={close}>
          <DrawerHeader title="絞り込み" />
          <DrawerBody>
            <form>
              <FormControl label="キーワード">
                <Input name="keyword" />
              </FormControl>
            </form>
          </DrawerBody>
          <DrawerFooter>
            <Button onClick={() => setIsOpen(false)}>適用</Button>
          </DrawerFooter>
        </InlineDrawer>
      }
    >
      <Button aria-expanded={isOpen} aria-controls={PANEL_ID} onClick={() => setIsOpen((v) => !v)}>
        絞り込みを切り替える
      </Button>
      <Button>メインのボタン</Button>
    </InlineDrawerLayout>
  )
}

const trigger = () => screen.getByRole('button', { name: '絞り込みを切り替える' })
const panel = () => document.getElementById(PANEL_ID)!

describe('InlineDrawer', () => {
  it('開いているとき、DrawerHeader の title をアクセシブル名に持つ補足ランドマークになること', () => {
    renderWithIntl(<Template initialOpen />)

    expect(screen.getByRole('complementary', { name: '絞り込み' })).toBe(panel())
  })

  it('閉じると aside が DOM に残ったまま hidden と inert になり、aria-controls の参照先が存在し続けること', async () => {
    renderWithIntl(<Template initialOpen />)

    await userEvent.click(trigger())

    await waitFor(() => expect(panel()).toHaveAttribute('hidden'))
    expect(panel()).toHaveAttribute('inert')
    expect(document.getElementById(trigger().getAttribute('aria-controls')!)).toBe(panel())
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('閉じている状態から開くと、hidden と inert が外れること', async () => {
    renderWithIntl(<Template />)

    expect(panel()).toHaveAttribute('hidden')

    await userEvent.click(trigger())

    await waitFor(() => expect(panel()).not.toHaveAttribute('inert'))
    expect(panel()).not.toHaveAttribute('hidden')
  })

  it('閉じても中身はアンマウントされず、入力した値が残ること', async () => {
    renderWithIntl(<Template initialOpen />)

    await userEvent.type(screen.getByRole('textbox', { name: 'キーワード' }), 'abc')
    await userEvent.click(trigger())
    await waitFor(() => expect(panel()).toHaveAttribute('hidden'))
    await userEvent.click(trigger())

    await waitFor(() => expect(panel()).not.toHaveAttribute('inert'))
    expect(screen.getByRole('textbox', { name: 'キーワード' })).toHaveValue('abc')
  })

  it('DrawerHeader の閉じるボタンで onClickClose が呼ばれること', async () => {
    const onClickClose = vi.fn()
    renderWithIntl(<Template initialOpen onClickClose={onClickClose} />)

    await userEvent.click(within(panel()).getByRole('button', { name: '閉じる' }))

    expect(onClickClose).toHaveBeenCalledTimes(1)
  })

  it('開いてもフォーカスを動かさないこと', async () => {
    renderWithIntl(<Template />)

    await userEvent.click(trigger())

    await waitFor(() => expect(panel()).not.toHaveAttribute('inert'))
    expect(trigger()).toHaveFocus()
  })

  it('Escape を押しても閉じないこと', async () => {
    const onClickClose = vi.fn()
    renderWithIntl(<Template initialOpen onClickClose={onClickClose} />)

    screen.getByRole('textbox', { name: 'キーワード' }).focus()
    await userEvent.keyboard('{Escape}')

    expect(onClickClose).not.toHaveBeenCalled()
    expect(panel()).not.toHaveAttribute('inert')
  })

  it('パネル内にフォーカスがあるまま閉じると、開いたときのトリガーへフォーカスが戻ること', async () => {
    renderWithIntl(<Template />)

    await userEvent.click(trigger())
    await waitFor(() => expect(panel()).not.toHaveAttribute('inert'))
    await userEvent.click(within(panel()).getByRole('button', { name: '閉じる' }))

    expect(trigger()).toHaveFocus()
  })

  it('開いたときのフォーカス位置が無くても、aria-controls でパネルを指す要素へフォーカスが戻ること', async () => {
    renderWithIntl(<Template initialOpen />)

    await userEvent.click(screen.getByRole('button', { name: '適用' }))

    expect(trigger()).toHaveFocus()
  })

  it('パネルの外にフォーカスがあるまま閉じても、フォーカスを動かさないこと', async () => {
    renderWithIntl(<Template initialOpen />)

    const mainButton = screen.getByRole('button', { name: 'メインのボタン' })
    mainButton.focus()
    trigger().click()

    await waitFor(() => expect(panel()).toHaveAttribute('hidden'))
    expect(mainButton).toHaveFocus()
  })

  it('size で幅が変わり、既定は S であること', () => {
    const { unmount } = renderWithIntl(<Template initialOpen />)
    expect(panel()).toHaveClass('shr-w-col4')
    unmount()

    renderWithIntl(<Template initialOpen size="L" />)
    expect(panel()).toHaveClass('shr-w-col6')
  })

  it('DrawerHeader の見出しが、外側の見出しより 1 段深いレベルになること', () => {
    renderWithIntl(
      <Section>
        <Heading>従業員一覧</Heading>
        <Template initialOpen />
      </Section>,
    )

    const level = (name: string) =>
      Number(screen.getByRole('heading', { name }).tagName.replace('H', ''))

    expect(level('絞り込み')).toBe(level('従業員一覧') + 1)
  })
})

describe('InlineDrawerLayout', () => {
  it('DOM 順が left → メイン → right になること', () => {
    renderWithIntl(
      <InlineDrawerLayout
        left={
          <InlineDrawer id="left" isOpen ariaLabel="左" onClickClose={() => undefined}>
            左
          </InlineDrawer>
        }
        right={
          <InlineDrawer id="right" isOpen ariaLabel="右" onClickClose={() => undefined}>
            右
          </InlineDrawer>
        }
      >
        <p>メイン</p>
      </InlineDrawerLayout>,
    )

    const left = screen.getByRole('complementary', { name: '左' })
    const main = screen.getByText('メイン')
    const right = screen.getByRole('complementary', { name: '右' })

    expect(left.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(main.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
