import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef, useState } from 'react'
import { IntlProvider } from 'smarthr-ui'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { RichTextEditor } from './RichTextEditor/RichTextEditor'
import { reconfigureEditorOperations } from './extensions/reconfigureEditorOperations'

import type { ImageUploadResult, RichTextEditorController, RichTextFeature } from './types'
import type { ReactNode } from 'react'

// jsdom には ResizeObserver が無く、挿入された画像の NodeView がマウント時に参照する。
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
})

// 再構成が走った回数を数える。実体はそのまま動かす
vi.mock('./extensions/reconfigureEditorOperations', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>

  return {
    ...actual,
    reconfigureEditorOperations: vi.fn(
      actual.reconfigureEditorOperations as typeof reconfigureEditorOperations,
    ),
  }
})

const reconfigureSpy = vi.mocked(reconfigureEditorOperations)

const Wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="ja">{children}</IntlProvider>
)

const getEditorDom = () => screen.getByRole('textbox')

const getPlaceholder = () =>
  document.querySelector('.ProseMirror [data-placeholder]')?.getAttribute('data-placeholder') ??
  null

// jsdom には DataTransfer が無いため、ProseMirror が読む分だけを持つ clipboardData を渡す。
const pasteFile = (file: File) => {
  fireEvent.paste(getEditorDom(), {
    clipboardData: {
      files: [file],
      types: ['Files', 'text/html', 'text/plain'],
      getData: () => '',
    },
  })
}

const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)))

const pngFile = () => new File(['x'], 'a.png', { type: 'image/png' })
const jpegFile = () => new File(['x'], 'a.jpg', { type: 'image/jpeg' })

describe('マウント後の props 更新', () => {
  it('placeholder の変更が本文へ反映される', async () => {
    const Host = () => {
      const [placeholder, setPlaceholder] = useState<string | undefined>(undefined)

      return (
        <>
          <button type="button" onClick={() => setPlaceholder('最初の文言')}>
            設定
          </button>
          <button type="button" onClick={() => setPlaceholder('次の文言')}>
            変更
          </button>
          <button type="button" onClick={() => setPlaceholder('')}>
            空に
          </button>
          <RichTextEditor placeholder={placeholder} />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    // 未指定でも extension は登録しておくため、属性は空文字で存在する
    expect(getPlaceholder()).toBe('')

    fireEvent.click(screen.getByRole('button', { name: '設定' }))
    await waitFor(() => expect(getPlaceholder()).toBe('最初の文言'))

    fireEvent.click(screen.getByRole('button', { name: '変更' }))
    await waitFor(() => expect(getPlaceholder()).toBe('次の文言'))

    fireEvent.click(screen.getByRole('button', { name: '空に' }))
    await waitFor(() => expect(getPlaceholder()).toBe(''))
  })

  it('onImageUpload の差し替え後は新しい関数だけが呼ばれる', async () => {
    const first = vi.fn(async (): Promise<ImageUploadResult> => ({ src: 'first.png' }))
    const second = vi.fn(async (): Promise<ImageUploadResult> => ({ src: 'second.png' }))

    const Host = () => {
      const [useSecond, setUseSecond] = useState(false)

      return (
        <>
          <button type="button" onClick={() => setUseSecond(true)}>
            差し替え
          </button>
          <RichTextEditor features={['image']} onImageUpload={useSecond ? second : first} />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    pasteFile(pngFile())
    await flush()
    expect(first).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: '差し替え' }))
    pasteFile(pngFile())
    await flush()

    expect(second).toHaveBeenCalledTimes(1)
    expect(first).toHaveBeenCalledTimes(1)
  })

  it('acceptedMimeTypes の変更が貼り付けの判定へ反映される', async () => {
    const onImageUpload = vi.fn(async (): Promise<ImageUploadResult> => ({ src: 'a.png' }))

    const Host = () => {
      const [types, setTypes] = useState(['image/png'])

      return (
        <>
          <button type="button" onClick={() => setTypes(['image/jpeg'])}>
            jpegへ
          </button>
          <RichTextEditor
            acceptedMimeTypes={types}
            features={['image']}
            onImageUpload={onImageUpload}
          />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    pasteFile(jpegFile())
    await flush()
    expect(onImageUpload).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'jpegへ' }))
    pasteFile(jpegFile())
    await flush()
    expect(onImageUpload).toHaveBeenCalledTimes(1)

    pasteFile(pngFile())
    await flush()
    expect(onImageUpload).toHaveBeenCalledTimes(1)
  })

  it('props の変更で本文と Editor を失わない', async () => {
    const Host = () => {
      const [placeholder, setPlaceholder] = useState('前')

      return (
        <>
          <button type="button" onClick={() => setPlaceholder('後')}>
            変更
          </button>
          <RichTextEditor
            defaultValue={{
              type: 'doc',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '入力した本文' }] }],
            }}
            features={['image']}
            placeholder={placeholder}
            onImageUpload={async () => ({ src: 'x.png' })}
          />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    const editorDom = getEditorDom()
    expect(editorDom).toHaveTextContent('入力した本文')

    fireEvent.click(screen.getByRole('button', { name: '変更' }))
    await flush()

    // 本文があるので placeholder の decoration は出ない
    expect(getPlaceholder()).toBeNull()
    // 同じ DOM ノードのままであれば Editor は作り直されていない
    expect(getEditorDom()).toBe(editorDom)
    expect(editorDom).toHaveTextContent('入力した本文')
  })

  it('features の変更がショートカットの可否へ反映される', async () => {
    const ref = createRef<RichTextEditorController>()

    const Host = () => {
      const [features, setFeatures] = useState<readonly RichTextFeature[]>(['bold'])

      return (
        <>
          <button type="button" onClick={() => setFeatures([])}>
            外す
          </button>
          <button type="button" onClick={() => setFeatures(['bold'])}>
            戻す
          </button>
          <RichTextEditor
            ref={ref}
            defaultValue={{
              type: 'doc',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'あいう' }] }],
            }}
            features={features}
          />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    // jsdom では ctrlKey が Mod として解釈される
    const pressBold = () => {
      const dom = getEditorDom()
      fireEvent.keyDown(dom, { key: 'a', ctrlKey: true })
      fireEvent.keyDown(dom, { key: 'b', ctrlKey: true })
    }
    const hasBold = () => JSON.stringify(ref.current?.getJSON()).includes('"type":"bold"')

    pressBold()
    expect(hasBold()).toBe(true)
    pressBold()
    expect(hasBold()).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: '外す' }))
    await flush()
    pressBold()
    expect(hasBold()).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: '戻す' }))
    await flush()
    pressBold()
    expect(hasBold()).toBe(true)
  })

  it('同じ内容の新しい配列では再構成しない', async () => {
    const Host = () => {
      const [, setTick] = useState(0)

      return (
        <>
          <button type="button" onClick={() => setTick((n) => n + 1)}>
            再描画
          </button>
          {/* 毎レンダー別の配列になるが内容は同じ */}
          <RichTextEditor features={['bold', 'italic']} />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    reconfigureSpy.mockClear()
    fireEvent.click(screen.getByRole('button', { name: '再描画' }))
    await flush()

    expect(reconfigureSpy).not.toHaveBeenCalled()
  })

  it('callback の変更だけでは再構成しない', async () => {
    const Host = () => {
      const [n, setN] = useState(0)

      return (
        <>
          <button type="button" onClick={() => setN((v) => v + 1)}>
            差し替え
          </button>
          <RichTextEditor features={['image']} onImageUpload={async () => ({ src: `${n}.png` })} />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    reconfigureSpy.mockClear()
    fireEvent.click(screen.getByRole('button', { name: '差し替え' }))
    await flush()

    expect(reconfigureSpy).not.toHaveBeenCalled()
  })

  it('features が実際に変わったときは再構成する', async () => {
    const Host = () => {
      const [features, setFeatures] = useState<readonly RichTextFeature[]>(['bold'])

      return (
        <>
          <button type="button" onClick={() => setFeatures(['bold', 'italic'])}>
            追加
          </button>
          <RichTextEditor features={features} />
        </>
      )
    }

    render(<Host />, { wrapper: Wrapper })
    await waitFor(() => expect(getEditorDom()).toBeInTheDocument())

    reconfigureSpy.mockClear()
    fireEvent.click(screen.getByRole('button', { name: '追加' }))
    await flush()

    expect(reconfigureSpy).toHaveBeenCalledTimes(1)
  })
})
