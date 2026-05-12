import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { IntlProvider } from '../../intl'
import { Button } from '../Button'
import { Heading } from '../Heading'
import { Section } from '../SectioningContent'

import { MessageDialogContent } from './ControlledMessageDialog'
import { DialogCloser } from './DialogCloser'
import { DialogContent } from './DialogContent'
import { DialogTrigger } from './DialogTrigger'
import { DialogWrapper } from './DialogWrapper'

describe('DialogWrapper', () => {
  describe('DialogContent', () => {
    const DialogContentTemplate = () => (
      <IntlProvider locale="ja">
        <DialogWrapper>
          <DialogTrigger>
            <Button>Dialog</Button>
          </DialogTrigger>
          <DialogContent ariaLabelledby="dialog-heading">
            <Section>
              <Heading id="dialog-heading">DialogContent</Heading>
              <p>Uncontrolled Dialog.</p>
              <DialogCloser>
                <Button>Close</Button>
              </DialogCloser>
            </Section>
          </DialogContent>
        </DialogWrapper>
      </IntlProvider>
    )
    it('DialogContent が開閉できること', async () => {
      render(<DialogContentTemplate />)

      expect(screen.queryByRole('dialog', { name: 'DialogContent' })).toBeNull()
      await userEvent.tab()
      await userEvent.keyboard('{enter}')
      expect(screen.getByRole('dialog', { name: 'DialogContent' })).toBeVisible()

      await userEvent.tab({ shift: true })
      await userEvent.keyboard('{ }')
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog', { name: 'DialogContent' })).toBeNull()
        },
        { timeout: 1000 },
      )
      // ダイアログを閉じた後、トリガがフォーカスされることを確認
      expect(screen.getByRole('button', { name: 'Dialog' })).toHaveFocus()
    })

    it('ダイアログの外側をクリックするとダイアログが閉じないこと', async () => {
      render(<DialogContentTemplate />)

      expect(screen.queryByRole('dialog', { name: 'DialogContent' })).toBeNull()
      act(() => {
        screen.getByRole('button', { name: 'Dialog' }).click()
      })
      expect(screen.getByRole('dialog', { name: 'DialogContent' })).toBeVisible()

      act(() => {
        screen
          .getAllByRole('presentation')
          .find((presentation) => presentation.classList.contains('smarthr-ui-Dialog-background'))
          ?.click()
      })
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog', { name: 'DialogContent' })).not.toBeNull()
        },
        { timeout: 1000 },
      )
    })
  })
})
