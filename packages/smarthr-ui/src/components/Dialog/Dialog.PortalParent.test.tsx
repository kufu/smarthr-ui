import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React, { useRef, useState } from 'react'

import { Button } from '../Button'
import { Heading } from '../Heading'
import { Section } from '../SectioningContent'

import { Dialog } from './Dialog'

describe('Dialog (Portal Parent)', () => {
  const DialogTemplate = () => {
    const portalParentRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div ref={portalParentRef}>
        <Button onClick={() => setIsOpen(true)}>Dialog を開く</Button>
        <Dialog
          isOpen={isOpen}
          onPressEscape={() => setIsOpen(false)}
          ariaLabel="Dialog"
          portalParent={portalParentRef}
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
  it('body 以外を親にしたダイアログが開閉できること', async () => {
    render(<DialogTemplate />)

    expect(screen.queryByRole('dialog', { name: 'Dialog' })).toBeNull()
    await act(() => userEvent.tab())
    await act(() => userEvent.keyboard('{enter}'))
    expect(screen.getByRole('dialog', { name: 'Dialog' })).toBeVisible()

    await act(() => userEvent.tab({ shift: true }))
    await act(() => userEvent.keyboard('{ }'))
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
