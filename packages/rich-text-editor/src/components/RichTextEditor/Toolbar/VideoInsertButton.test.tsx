import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from '../RichTextEditor/RichTextEditor'

import type { RichTextEditorController, RichTextFeature, RichTextVideo } from '../types'
import type { ReactNode } from 'react'

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">
    <EnvironmentProvider>{children}</EnvironmentProvider>
  </IntlProvider>
)

const VIDEOS: RichTextVideo[] = [
  { src: 'https://example.com/a.mp4', title: 'サンプル動画A', poster: '/a.jpg', duration: 65 },
  { src: '/b.mp4', title: 'Sample Movie', duration: 3725 },
]

type LoadVideos = (context: { signal: AbortSignal }) => Promise<readonly RichTextVideo[]>

const renderEditor = async ({
  features = ['video'],
  loadVideos,
}: {
  features?: RichTextFeature[]
  loadVideos?: LoadVideos
}) => {
  const ref = createRef<RichTextEditorController>()
  const result = render(<RichTextEditor ref={ref} features={features} loadVideos={loadVideos} />, {
    wrapper: Wrapper,
  })
  await waitFor(() => expect(screen.getByRole('textbox')).toBeInTheDocument())

  return { ...result, ref }
}

const getTrigger = () => screen.getByRole('button', { name: '動画を挿入' })
const queryPicker = () => screen.queryByRole('dialog', { name: '動画を挿入' })
const findOption = (name: RegExp) => screen.findByRole('button', { name })
const optionNames = () =>
  Array.from(queryPicker()?.querySelectorAll('li button') ?? [], (button) => button.textContent)

afterEach(() => {
  vi.restoreAllMocks()
})

describe('VideoInsertButton', () => {
  it.each<[string, RichTextFeature[], boolean, boolean]>([
    ['features に video があり loadVideos がある', ['video'], true, true],
    ['loadVideos が無い', ['video'], false, false],
    ['features に video が無い', ['image'], true, false],
  ])('%s とき、ボタンを出すか', async (_, features, hasLoader, shown) => {
    await renderEditor({ features, loadVideos: hasLoader ? vi.fn(async () => VIDEOS) : undefined })

    expect(screen.queryByRole('button', { name: '動画を挿入' }) !== null).toBe(shown)
  })

  it('開くたびに signal を渡して読み込み、閉じると中断する', async () => {
    const user = userEvent.setup()
    const loadVideos = vi.fn<LoadVideos>(async () => VIDEOS)
    await renderEditor({ loadVideos })

    await user.click(getTrigger())
    await findOption(/サンプル動画A/)
    const [{ signal }] = loadVideos.mock.calls[0]
    expect(signal.aborted).toBe(false)

    await user.click(getTrigger())
    expect(queryPicker()).not.toBeInTheDocument()
    expect(signal.aborted).toBe(true)

    await user.click(getTrigger())
    await findOption(/サンプル動画A/)
    expect(loadVideos).toHaveBeenCalledTimes(2)
  })

  it('読み込み中を示し、失敗したら再読み込みできる', async () => {
    const user = userEvent.setup()
    let rejectFirst: (reason: unknown) => void = () => {}
    const loadVideos = vi
      .fn<LoadVideos>()
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectFirst = reject
          }),
      )
      .mockResolvedValueOnce(VIDEOS)
    await renderEditor({ loadVideos })

    await user.click(getTrigger())
    expect(await screen.findByText('読み込み中...')).toBeInTheDocument()

    act(() => rejectFirst(new Error('network')))
    expect(await screen.findByText('動画の一覧を読み込めませんでした。')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '再読み込み' }))
    expect(await findOption(/サンプル動画A/)).toBeInTheDocument()
    expect(screen.queryByText('動画の一覧を読み込めませんでした。')).not.toBeInTheDocument()
    expect(loadVideos).toHaveBeenCalledTimes(2)
  })

  it('キーボードで再読み込みしても、フォーカスが一覧の外へ落ちない', async () => {
    const user = userEvent.setup()
    let resolveRetry: (videos: readonly RichTextVideo[]) => void = () => {}
    const loadVideos = vi
      .fn<LoadVideos>()
      .mockRejectedValueOnce(new Error('network'))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRetry = resolve
          }),
      )
    await renderEditor({ loadVideos })

    getTrigger().focus()
    await user.keyboard('{Enter}')
    const search = screen.getByRole('searchbox', { name: '動画を検索' })
    await waitFor(() => expect(search).toHaveFocus())
    const retry = await screen.findByRole('button', { name: '再読み込み' })
    await user.tab()
    expect(retry).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(await screen.findByText('読み込み中...')).toBeInTheDocument()
    expect(search).toHaveFocus()

    act(() => resolveRetry(VIDEOS))
    await findOption(/サンプル動画A/)
    expect(search).toHaveFocus()
  })

  it('動画が無いときと、絞り込んで該当が無いときを出し分ける', async () => {
    const user = userEvent.setup()
    const loadVideos = vi.fn<LoadVideos>().mockResolvedValueOnce([]).mockResolvedValue(VIDEOS)
    await renderEditor({ loadVideos })

    await user.click(getTrigger())
    expect(await screen.findByText('動画がありません。')).toBeInTheDocument()

    await user.click(getTrigger())
    await user.click(getTrigger())
    await findOption(/サンプル動画A/)
    await user.type(screen.getByRole('searchbox', { name: '動画を検索' }), 'xyz')

    expect(screen.getByText('該当する動画がありません。')).toBeInTheDocument()
    expect(optionNames()).toEqual([])
  })

  it.each([
    ['ひらがな', 'さんぷる', ['サンプル動画A1:05']],
    ['半角カタカナ', 'ｻﾝﾌﾟﾙ', ['サンプル動画A1:05']],
    ['全角英字', 'ｓａｍｐｌｅ', ['Sample Movie1:02:05']],
    ['大文字', 'MOVIE', ['Sample Movie1:02:05']],
  ])('%s で入力しても、表記の違いを無視して絞り込む', async (_, query, expected) => {
    const user = userEvent.setup()
    await renderEditor({ loadVideos: vi.fn(async () => VIDEOS) })

    await user.click(getTrigger())
    await findOption(/サンプル動画A/)
    await user.type(screen.getByRole('searchbox', { name: '動画を検索' }), query)

    expect(optionNames()).toEqual(expected)
  })

  it('src・poster が安全でない動画は一覧に出さず、開発者向けに警告する', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await renderEditor({
      loadVideos: vi.fn(async () => [
        ...VIDEOS,
        { src: 'javascript:alert(1)', title: '不正な src' },
        { src: '/c.mp4', title: '不正な poster', poster: '//evil.example/c.jpg' },
      ]),
    })

    await user.click(getTrigger())
    await findOption(/サンプル動画A/)

    expect(optionNames()).toEqual(['サンプル動画A1:05', 'Sample Movie1:02:05'])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(JSON.stringify(warn.mock.calls[0])).toContain('不正な poster')
  })

  it('poster が null の動画も一覧に出し、poster 無しとして挿入する', async () => {
    const user = userEvent.setup()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { ref } = await renderEditor({
      loadVideos: vi.fn(async () => [{ src: '/c.mp4', title: 'サムネイル無し', poster: null }]),
    })

    await user.click(getTrigger())
    await user.click(await findOption(/サムネイル無し/))

    expect(ref.current?.getJSON().content).toContainEqual(
      expect.objectContaining({
        type: 'video',
        attrs: expect.objectContaining({ src: '/c.mp4', poster: null }),
      }),
    )
    expect(warn).not.toHaveBeenCalled()
  })

  it('キーボードだけで、開いて絞り込み、一覧から挿入でき、本文へフォーカスが戻る', async () => {
    const user = userEvent.setup()
    const { ref } = await renderEditor({ loadVideos: vi.fn(async () => VIDEOS) })

    getTrigger().focus()
    await user.keyboard('{Enter}')
    const search = screen.getByRole('searchbox', { name: '動画を検索' })
    await waitFor(() => expect(search).toHaveFocus())
    await findOption(/サンプル動画A/)

    await user.keyboard('movie{ArrowDown}')
    expect(screen.getByRole('button', { name: /Sample Movie/ })).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(search).toHaveFocus()

    await user.keyboard('{ArrowDown}{Enter}')

    expect(ref.current?.getJSON().content).toContainEqual({
      type: 'video',
      attrs: {
        src: '/b.mp4',
        poster: null,
        title: 'Sample Movie',
        width: null,
        height: null,
        align: null,
      },
    })
    expect(queryPicker()).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus())
  })

  it('一覧の動画の名前をクリックすると、その動画を挿入する', async () => {
    const user = userEvent.setup()
    const { ref } = await renderEditor({ loadVideos: vi.fn(async () => VIDEOS) })

    await user.click(getTrigger())
    await findOption(/サンプル動画A/)
    await user.click(screen.getByText('Sample Movie'))

    expect(ref.current?.getJSON().content).toContainEqual(
      expect.objectContaining({ type: 'video', attrs: expect.objectContaining({ src: '/b.mp4' }) }),
    )
    expect(queryPicker()).not.toBeInTheDocument()
  })

  it('Esc で閉じてトリガーへ戻り、読み込みを中断する', async () => {
    const user = userEvent.setup()
    const loadVideos = vi.fn<LoadVideos>(() => new Promise(() => {}))
    await renderEditor({ loadVideos })

    getTrigger().focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.getByRole('searchbox', { name: '動画を検索' })).toHaveFocus())

    await user.keyboard('{Escape}')

    expect(queryPicker()).not.toBeInTheDocument()
    expect(getTrigger()).toHaveFocus()
    expect(loadVideos.mock.calls[0][0].signal.aborted).toBe(true)
  })

  it('描画のたびに loadVideos を作り直しても、開いている間に読み直さない', async () => {
    const user = userEvent.setup()
    const first = vi.fn<LoadVideos>(async () => VIDEOS)
    const second = vi.fn<LoadVideos>(async () => VIDEOS)
    const { rerender } = await renderEditor({ loadVideos: first })

    await user.click(getTrigger())
    await findOption(/サンプル動画A/)
    rerender(<RichTextEditor features={['video']} loadVideos={second} />)

    expect(await findOption(/サンプル動画A/)).toBeInTheDocument()
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).not.toHaveBeenCalled()
  })

  it('開いている間に features が変わっても、読み直さない', async () => {
    const user = userEvent.setup()
    const loadVideos = vi.fn<LoadVideos>(async () => VIDEOS)
    const { rerender } = await renderEditor({ loadVideos })

    await user.click(getTrigger())
    await findOption(/サンプル動画A/)
    rerender(<RichTextEditor features={['video', 'bold']} loadVideos={loadVideos} />)

    expect(await findOption(/サンプル動画A/)).toBeInTheDocument()
    expect(loadVideos).toHaveBeenCalledTimes(1)
  })
})
