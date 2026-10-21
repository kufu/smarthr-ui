import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { Button } from '../Button'
import { Heading } from '../Heading'
import { Section } from '../SectioningContent'

import { Dialog } from './Dialog'

const waitForAnimationFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

describe('Dialog (Portal Parent)', () => {
  const DialogTemplate = () => {
    // portalParent は確定済みの要素を渡す必要があるため、ダイアログと同時にマウントされる
    // 祖先要素の ref をそのまま渡すのではなく、callback ref で要素が確定してから渡す
    const [portalParent, setPortalParent] = useState<HTMLDivElement | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div ref={setPortalParent} data-testid="portal-parent">
        <Button onClick={() => setIsOpen(true)}>Dialog を開く</Button>
        {portalParent && (
          <Dialog
            isOpen={isOpen}
            portalParent={portalParent}
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
        )}
      </div>
    )
  }
  it('body 以外を親にしたダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
    await userEvent.tab()
    await userEvent.keyboard('{enter}')

    const dialogEl = screen.getByRole('dialog', { name: 'Dialog' })
    expect(dialogEl).toBeVisible()
    // 実際に指定した portalParent の中に生成されていることを確認する
    expect(screen.getByTestId('portal-parent')).toContainElement(dialogEl)

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
