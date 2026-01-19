/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render } from '@testing-library/react'
import { waitFor } from 'storybook/internal/test'

import { PageHeading } from './PageHeading'

const setupNextjsMock = () => {
  ;(window as any).next = {}
}

const clearNextjsMock = () => {
  delete (window as any).next
}

describe('PageHeading', () => {
  afterEach(() => {
    clearNextjsMock()
    document.title = ''
  })

  test('ページのタイトルを自動で設定する', async () => {
    render(<PageHeading>これはタイトルです</PageHeading>)
    expect(document.title).toBe('これはタイトルです｜SmartHR（スマートHR）')

    await waitFor(() => {
      expect(document.querySelector(`*[aria-live="polite"]`)).toHaveTextContent(
        'これはタイトルです｜SmartHR（スマートHR）',
      )
    })
  })

  test('autoPageTitle=falseではページのタイトルを設定しない', () => {
    render(<PageHeading autoPageTitle={false}>これはタイトルです</PageHeading>)
    expect(document.title).toBe('')
  })

  test('Next.js環境ではページのタイトル読み上げを行わない', () => {
    setupNextjsMock()
    render(<PageHeading>これはタイトルです</PageHeading>)
    expect(document.querySelector(`*[aria-live="polite"]`)).toBeNull()
  })
})
