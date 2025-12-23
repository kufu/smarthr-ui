import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

import { Button } from '../Button'

import { DisclosureContent } from './DisclosureContent'
import { DisclosureTrigger } from './DisclosureTrigger'

describe('Disclosure', () => {
  describe('isOpen未設定', () => {
    beforeEach(() => {
      render(
        <div className="App">
          <DisclosureTrigger targetId="dc">
            <Button>押してね</Button>
          </DisclosureTrigger>

          <DisclosureContent id="dc">
            <p>これは詳細です</p>
          </DisclosureContent>
        </div>,
      )
    })

    test('開閉できる', async () => {
      await userEvent.click(screen.getByRole('button', { name: '押してね', expanded: false }))

      await waitFor(async () => {
        expect(screen.getByText('これは詳細です')).toBeInTheDocument()
      })

      await userEvent.click(screen.getByRole('button', { name: '押してね', expanded: true }))

      await waitFor(async () => {
        expect(screen.queryByText('これは詳細です')).toBeNull()
      })
    })
  })

  describe('DisclosureContentよりもさきにDisclosureTriggerがある場合', () => {
    beforeEach(() => {
      render(
        <div className="App">
          <DisclosureTrigger targetId="dc">
            <Button>開く</Button>
          </DisclosureTrigger>

          <DisclosureContent id="dc" isOpen>
            <p>これは詳細です</p>
          </DisclosureContent>
        </div>,
      )
    })

    test('isOpenが反映される', async () => {
      await waitFor(() => {
        expect(screen.getByText('これは詳細です')).toBeInTheDocument()
      })
    })

    test('ボタンを押しても隠れない', async () => {
      await waitFor(() => {
        userEvent.click(screen.getByRole('button', { name: '開く', expanded: true }))
        expect(screen.getByText('これは詳細です')).toBeInTheDocument()
      })
    })
  })

  describe('SHRUI-1324: DisclosureContentよりもあとにDisclosureTriggerがある場合', () => {
    beforeEach(() => {
      render(
        <div className="App">
          <DisclosureContent id="dc" isOpen>
            <p>これは詳細です</p>
          </DisclosureContent>

          <DisclosureTrigger targetId="dc">
            <Button>開く</Button>
          </DisclosureTrigger>
        </div>,
      )
    })

    test('isOpenが反映される', async () => {
      await waitFor(() => {
        expect(screen.getByText('これは詳細です')).toBeInTheDocument()
      })
    })

    test('ボタンを押しても隠れない', async () => {
      await waitFor(() => {
        userEvent.click(screen.getByRole('button', { name: '開く', expanded: true }))
        expect(screen.getByText('これは詳細です')).toBeInTheDocument()
      })
    })
  })
})
