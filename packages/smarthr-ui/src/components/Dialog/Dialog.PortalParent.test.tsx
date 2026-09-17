import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'

import { Button } from '../Button'
import { Heading } from '../Heading'
import { Section } from '../SectioningContent'

import { Dialog } from './Dialog'

const waitForAnimationFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

describe('Dialog (Portal Parent)', () => {
  const DialogTemplate = () => {
    const portalParentRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div ref={portalParentRef} data-testid="portal-parent">
        <Button onClick={() => setIsOpen(true)}>Dialog を開く</Button>
        <Dialog
          isOpen={isOpen}
          portalParent={portalParentRef}
          ariaLabel="Dialog"
          onPressEscape={() => setIsOpen(false)}
        >
          <Section>
            <Heading>Dialog</Heading>
            <p>Dialog を近接要素に生成しています。</p>
          </Section>
          <div>
            <Button onClick={() => setIsOpen(false)}>閉じる</Button>
          </div>
        </Dialog>
      </div>
    )
  }
  // React は子から順にコミットするため、portalParent に渡した ref が Dialog の
  // 祖先要素を指す場合、Dialog 側の useLayoutEffect の時点ではまだ ref が付いていない。
  // ここで body へフォールバックしたままだと、absolute 配置の基準が指定要素にならない。
  it('portalParent に指定した要素の内側に生成されること', async () => {
    render(<DialogTemplate />)

    await userEvent.tab()
    await userEvent.keyboard('{enter}')

    const dialog = screen.getByRole('dialog', { name: 'Dialog' })
    const portalParent = screen.getByTestId('portal-parent')

    await waitFor(() => {
      expect(portalParent).toContainElement(dialog)
    })
  })

  it('body 以外を親にしたダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeVisible()

    // FocusTrap はカスケード更新完了後の requestAnimationFrame でフォーカスするため、フレームが進むのを待つ
    await waitForAnimationFrame()

    await userEvent.tab({ shift: true })
    await userEvent.keyboard('{ }')
    await waitFor(
      () => {
        expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
      },
      { timeout: 1000 },
    )
    // ダイアログを閉じた後、トリガがフォーカスされることを確認
    expect(screen.getByRole('button', { name: 'Dialog を開く' })).toHaveFocus()
  })
})
