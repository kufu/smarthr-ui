/* eslint-disable smarthr/a11y-heading-in-sectioning-content */
import { render, waitFor } from '@testing-library/react'
import { createRef } from 'react'

import { FaAddressBookIcon } from '../../../Icon'

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

  test.each([true, false])(
    'autoPageTitle=%sでも見出しにアイコンを表示する',
    async (autoPageTitle) => {
      const { getByRole, getByTestId } = render(
        <PageHeading autoPageTitle={autoPageTitle} icon={<FaAddressBookIcon data-testid="icon" />}>
          これはタイトルです
        </PageHeading>,
      )

      expect(getByRole('heading', { level: 1, name: 'これはタイトルです' })).toContainElement(
        getByTestId('icon'),
      )
      await waitForAnimationFrame()
      expect(document.title).toBe(autoPageTitle ? 'これはタイトルです｜SmartHR（スマートHR）' : '')
    },
  )

  test.each([true, false])(
    'visuallyHiddenではautoPageTitle=%sでもアイコンを描画しない',
    async (autoPageTitle) => {
      const { getByRole, queryByTestId } = render(
        <PageHeading
          autoPageTitle={autoPageTitle}
          visuallyHidden
          icon={<FaAddressBookIcon data-testid="icon" />}
        >
          これはタイトルです
        </PageHeading>,
      )

      expect(getByRole('heading', { level: 1 })).toHaveTextContent('これはタイトルです')
      expect(queryByTestId('icon')).not.toBeInTheDocument()
      expect(getByRole('heading', { level: 1 })).not.toHaveAttribute('icon')
      await waitForAnimationFrame()
      expect(document.title).toBe(autoPageTitle ? 'これはタイトルです｜SmartHR（スマートHR）' : '')
    },
  )

  test.each([
    [undefined, '連絡帳これはタイトルです｜SmartHR（スマートHR）'],
    ['ページタイトル', 'ページタイトル｜SmartHR（スマートHR）'],
  ])('アイコンの代替テキストがある場合もpageTitle=%sに従う', async (pageTitle, expected) => {
    render(
      <PageHeading pageTitle={pageTitle} icon={<FaAddressBookIcon alt="連絡帳" />}>
        これはタイトルです
      </PageHeading>,
    )

    await waitForAnimationFrame()
    expect(document.title).toBe(expected)
    expect(document.querySelector('[aria-live="polite"]')).toHaveTextContent(expected)
  })

  test('Next.js環境ではページのタイトルを設定しない', async () => {
    vi.resetModules()
    vi.doMock('../../../../libs/nextjs', () => ({ IS_NEXT_JS: true }))

    const { PageHeading: MockedPageHeading } = await import('./PageHeading')
    render(<MockedPageHeading>これはタイトルです</MockedPageHeading>)

    await waitForAnimationFrame()
    expect(document.title).toBe('')
    expect(document.querySelector(`*[aria-live="polite"]`)).toBeNull()
  })
})
