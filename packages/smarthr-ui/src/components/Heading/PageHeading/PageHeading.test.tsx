/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render, waitFor } from '@testing-library/react'
import { createRef } from 'react'

import { PageHeading } from './PageHeading'

const waitForAnimationFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

describe('PageHeading', () => {
  afterEach(() => {
    document.title = ''
  })

  // HINT: React 19 は ref を通常の props として扱うため forwardRef がなくても動いてしまい、
  // 挙動のテストだけでは React 18 でのデグレを検知できない。そのため構造そのものを検証する
  test('React 18 でも ref を転送できるよう memo(forwardRef()) でラップされている', () => {
    const memoized = PageHeading as unknown as { $$typeof: symbol; type: { $$typeof: symbol } }

    expect(memoized.$$typeof).toBe(Symbol.for('react.memo'))
    expect(memoized.type.$$typeof).toBe(Symbol.for('react.forward_ref'))
  })

  test('ページのタイトルを自動で設定する', async () => {
    render(<PageHeading>これはタイトルです</PageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('これはタイトルです｜SmartHR（スマートHR）')
    expect(document.querySelector(`*[aria-live="polite"]`)).toHaveTextContent(
      'これはタイトルです｜SmartHR（スマートHR）',
    )
  })

  test('visuallyHiddenでもページのタイトルを自動で設定する', async () => {
    render(<PageHeading visuallyHidden>これはタイトルです</PageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('これはタイトルです｜SmartHR（スマートHR）')
  })

  test('childrenの変更にページのタイトルが追従する', async () => {
    const { rerender } = render(<PageHeading>これはタイトルです</PageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('これはタイトルです｜SmartHR（スマートHR）')

    rerender(<PageHeading>タイトルが変わりました</PageHeading>)

    await waitFor(() => {
      expect(document.title).toBe('タイトルが変わりました｜SmartHR（スマートHR）')
    })
  })

  test('pageTitleSuffixに空文字を渡すと区切り文字を含めずsuffixを空にできる', async () => {
    render(<PageHeading pageTitleSuffix="">これはタイトルです</PageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('これはタイトルです')
  })

  test('利用者が渡したrefにh1要素を設定する', async () => {
    const ref = createRef<HTMLHeadingElement>()
    render(<PageHeading ref={ref}>これはタイトルです</PageHeading>)

    await waitForAnimationFrame()
    expect(ref.current?.tagName).toBe('H1')
    expect(document.title).toBe('これはタイトルです｜SmartHR（スマートHR）')
  })

  test('autoPageTitle=falseでも利用者が渡したrefにh1要素を設定する', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(
      <PageHeading ref={ref} autoPageTitle={false}>
        これはタイトルです
      </PageHeading>,
    )

    expect(ref.current?.tagName).toBe('H1')
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
