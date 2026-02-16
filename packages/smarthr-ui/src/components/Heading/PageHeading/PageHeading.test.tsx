/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render } from '@testing-library/react'

import { PageHeading } from './PageHeading'

const waitForAnimationFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

describe('PageHeading', () => {
  afterEach(() => {
    document.title = ''
  })

  test('ページのタイトルを自動で設定する', async () => {
    render(<PageHeading>これはタイトルです</PageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('これはタイトルです｜SmartHR（スマートHR）')
    expect(document.querySelector(`*[aria-live="polite"]`)).toHaveTextContent(
      'これはタイトルです｜SmartHR（スマートHR）',
    )
  })

  test('autoPageTitle=falseではページのタイトルを設定しない', async () => {
    render(<PageHeading autoPageTitle={false}>これはタイトルです</PageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('')
    expect(document.querySelector(`*[aria-live="polite"]`)).toBeNull()
  })

  test('Next.js環境ではページのタイトルを設定しない', async () => {
    vi.resetModules()
    vi.doMock('../../../libs/nextjs', () => ({ IS_NEXT_JS: true }))

    const { PageHeading: MockedPageHeading } = await import('./PageHeading')
    render(<MockedPageHeading>これはタイトルです</MockedPageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('')
    expect(document.querySelector(`*[aria-live="polite"]`)).toBeNull()
  })
})
