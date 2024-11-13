import { userEvent } from '@storybook/test'
import { act, render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { Button } from '../Button'
import { Heading } from '../Heading'
import { Section } from '../SectioningContent'

import { ActionDialogContent } from './ActionDialog/ActionDialogContent'
import { DialogCloser } from './DialogCloser'
import { DialogContent } from './DialogContent'
import { DialogTrigger } from './DialogTrigger'
import { DialogWrapper } from './DialogWrapper'
import { MessageDialogContent } from './MessageDialog'

describe('DialogWrapper', () => {
  describe('DialogContent', () => {
    const DialogContentTemplate = () => (
      <DialogWrapper>
        <DialogTrigger>
          <Button>Dialog</Button>
        </DialogTrigger>
        <DialogContent ariaLabelledby="dialog-title">
          <Section>
            <Heading id="dialog-title">DialogContent</Heading>
            <p>Uncontrolled Dialog.</p>
            <DialogCloser>
              <Button>Close</Button>
            </DialogCloser>
          </Section>
        </DialogContent>
      </DialogWrapper>
    )
    it('DialogContent が開閉できること', async () => {
      render(<DialogContentTemplate />)

      expect(screen.queryByRole('dialog', { name: 'DialogContent' })).toBeNull()
      await act(() => userEvent.tab())
      await act(() => userEvent.keyboard('{enter}'))
      expect(screen.getByRole('dialog', { name: 'DialogContent' })).toBeVisible()

      await act(() => userEvent.tab({ shift: true }))
      await act(() => userEvent.keyboard('{ }'))
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
  describe('MessageDialogContent', () => {
    const MessageDialogContentTemplate = () => (
      <DialogWrapper>
        <DialogTrigger>
          <Button>MessageDialog</Button>
        </DialogTrigger>
        <MessageDialogContent
          title="Uncontrolled Message Dialog"
          description={
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
              <br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
              <br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
              <br />
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          }
        />
      </DialogWrapper>
    )
    it('MessageDialogContent が開閉できること', async () => {
      render(<MessageDialogContentTemplate />)

      expect(screen.queryByRole('dialog', { name: 'DialogContent' })).toBeNull()
      await act(() => userEvent.tab())
      await act(() => userEvent.keyboard('{enter}'))
      expect(screen.getByRole('dialog', { name: 'Uncontrolled Message Dialog' })).toBeVisible()

      await act(() => userEvent.tab({ shift: true }))
      await act(() => userEvent.keyboard('{ }'))
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog', { name: 'Uncontrolled Message Dialog' })).toBeNull()
        },
        { timeout: 1000 },
      )
      // ダイアログを閉じた後、トリガがフォーカスされることを確認
      expect(screen.getByRole('button', { name: 'MessageDialog' })).toHaveFocus()
    })

    it('ダイアログの外側をクリックするとダイアログが閉じないこと', async () => {
      render(<MessageDialogContentTemplate />)

      expect(screen.queryByRole('dialog', { name: 'Uncontrolled Message Dialog' })).toBeNull()
      act(() => {
        screen.getByRole('button', { name: 'MessageDialog' }).click()
      })
      expect(screen.getByRole('dialog', { name: 'Uncontrolled Message Dialog' })).toBeVisible()

      act(() => {
        screen
          .getAllByRole('presentation')
          .find((presentation) => presentation.classList.contains('smarthr-ui-Dialog-background'))
          ?.click()
      })
      await waitFor(
        () => {
          expect(
            screen.queryByRole('dialog', { name: 'Uncontrolled Message Dialog' }),
          ).not.toBeNull()
        },
        { timeout: 1000 },
      )
    })
  })
  describe('ActionDialogContent', () => {
    const ActionDialogContentTemplate = () => (
      <DialogWrapper>
        <DialogTrigger>
          <Button>ActionDialog</Button>
        </DialogTrigger>
        <ActionDialogContent
          title="Uncontrolled Action Dialog"
          actionText="実行"
          actionDisabled={false}
          onClickAction={(closeDialog) => {
            closeDialog()
          }}
        >
          <p>
            The content of ActionDialogContent is freely implemented by the user as children.
            <br />
            So you need to prepare your own style.
            <br />
            When action is executed, you can specify when to close dialog. In this story, dialog
            closes one second after clicking action
          </p>
        </ActionDialogContent>
      </DialogWrapper>
    )
    it('ActionDialogContent が開閉できること', async () => {
      render(<ActionDialogContentTemplate />)

      expect(screen.queryByRole('dialog', { name: 'Uncontrolled Action Dialog' })).toBeNull()
      await act(() => userEvent.tab())
      await act(() => userEvent.keyboard('{enter}'))
      expect(screen.getByRole('dialog', { name: 'Uncontrolled Action Dialog' })).toBeVisible()

      await act(() => userEvent.tab({ shift: true }))
      await act(() => userEvent.keyboard('{ }'))
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog', { name: 'Uncontrolled Action Dialog' })).toBeNull()
        },
        { timeout: 1000 },
      )
      // ダイアログを閉じた後、トリガがフォーカスされることを確認
      expect(screen.getByRole('button', { name: 'ActionDialog' })).toHaveFocus()
    })

    it('ダイアログの外側をクリックするとダイアログが閉じないこと', async () => {
      render(<ActionDialogContentTemplate />)

      expect(screen.queryByRole('dialog', { name: 'Uncontrolled Action Dialog' })).toBeNull()
      act(() => {
        screen.getByRole('button', { name: 'ActionDialog' }).click()
      })
      expect(screen.getByRole('dialog', { name: 'Uncontrolled Action Dialog' })).toBeVisible()

      act(() => {
        screen
          .getAllByRole('presentation')
          .find((presentation) => presentation.classList.contains('smarthr-ui-Dialog-background'))
          ?.click()
      })
      await waitFor(
        () => {
          expect(
            screen.queryByRole('dialog', { name: 'Uncontrolled Action Dialog' }),
          ).not.toBeNull()
        },
        { timeout: 1000 },
      )
    })
  })
})
