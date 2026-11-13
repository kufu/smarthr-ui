import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'

import { TokenTextarea, type TokenTextareaHandle, type TokenTextareaSegment } from './client'
// eslint-disable-next-line smarthr/require-barrel-import -- 公開しない DOM と値の変換処理を直接テストするため
import { readClipboard, readValue, toHtml } from './client/editor'

const NAME = { value: 'name', label: '氏名' }
const DEPT = { value: 'dept', label: '部署' }

// 改行を含め、トークンで始まる行・トークンで終わる行・空行を持つ値
const VALUE: TokenTextareaSegment[] = [NAME, 'さん\n\n', DEPT, 'の', NAME]

const stripSrc = (html: string) => html.replace(/ src="[^"]*"/g, '')

// HINT: jsdom は ClipboardEvent の clipboardData を持たないため、getData/setData だけを持つオブジェクトで代用する
const createClipboardEvent = (type: string, data: Record<string, string> = {}) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const store = { ...data }

  Object.defineProperty(event, 'clipboardData', {
    value: {
      getData: (format: string) => store[format] ?? '',
      setData: (format: string, value: string) => {
        store[format] = value
      },
    },
  })

  return { event, store }
}

describe('TokenTextarea editor', () => {
  it('値を1行1つのdivとして描画し、トークンは透明な画像にする', () => {
    expect(stripSrc(toHtml(VALUE))).toBe(
      '<div><img data-smarthr-ui-token="name" alt="氏名">さん</div>' +
        '<div><br></div>' +
        '<div><img data-smarthr-ui-token="dept" alt="部署">の<img data-smarthr-ui-token="name" alt="氏名"></div>',
    )

    const root = document.createElement('div')

    root.innerHTML = toHtml(VALUE)

    expect(readValue(root)).toEqual(VALUE)
  })

  it('ブラウザの編集で崩れたDOMや貼り付けられたHTMLも読み取れる', () => {
    const root = document.createElement('div')

    root.innerHTML =
      'あ<b>い</b><div>う<br>え</div><div><br></div><p>お<span style="font-size: 1rem">か</span><img data-smarthr-ui-token="name" alt="氏名"></p><style>x{}</style>'

    expect(readValue(root)).toEqual(['あい\nう\nえ\n\nおか', NAME])
  })

  it('TokenTextarea からコピーした内容以外は書式を捨ててテキストとして読む', () => {
    const { store } = createClipboardEvent('paste', {
      'text/plain': 'a\r\nb',
      'text/html': '<b>a</b><br>b',
    })
    const data = { getData: (format: string) => store[format] ?? '' } as DataTransfer

    expect(readClipboard(data)).toEqual(['a\nb'])
  })
})

describe('TokenTextarea', () => {
  const OriginalResizeObserver = global.ResizeObserver
  const originalExecCommand = document.execCommand

  beforeEach(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
    // HINT: jsdom は execCommand を実装していないため、呼び出しを記録する
    document.execCommand = vi.fn(() => true)
  })

  afterEach(() => {
    global.ResizeObserver = OriginalResizeObserver
    document.execCommand = originalExecCommand
  })

  it('textbox として描画され、トークンは label で読み上げられる', () => {
    render(<TokenTextarea name="body" defaultValue={VALUE} aria-label="本文" />)

    const textbox = screen.getByRole('textbox', { name: '本文' })

    expect(textbox).toHaveAttribute('aria-multiline', 'true')
    expect(screen.getAllByRole('img', { name: '氏名' })).toHaveLength(2)
  })

  it('renderToken で描いた見た目は読み上げ対象から外れる', () => {
    render(
      <TokenTextarea
        name="body"
        defaultValue={VALUE}
        renderToken={(token) => <b>見た目:{token.label}</b>}
        aria-label="本文"
      />,
    )

    const visual = screen.getByText('見た目:部署')

    expect(visual.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('insertToken は最後のキャレット位置を復元し、undo できるよう execCommand で挿入する', () => {
    const ref = createRef<TokenTextareaHandle>()

    render(<TokenTextarea ref={ref} name="body" defaultValue={['ab']} aria-label="本文" />)

    const textbox = screen.getByRole('textbox')
    const text = textbox.querySelector('div')!.firstChild!

    act(() => {
      textbox.focus()
      document.getSelection()!.collapse(text, 1)
      document.dispatchEvent(new Event('selectionchange'))
      textbox.blur()
      document.getSelection()!.removeAllRanges()
      ref.current!.insertToken(DEPT)
    })

    expect(document.activeElement).toBe(textbox)
    expect(document.getSelection()!.focusNode).toBe(text)
    expect(document.getSelection()!.focusOffset).toBe(1)
    expect(document.execCommand).toHaveBeenCalledWith(
      'insertHTML',
      false,
      expect.stringContaining('data-smarthr-ui-token="dept"'),
    )
  })

  it('入力に応じて onChange が呼ばれ、フォーム送信用の値も更新される', () => {
    const onChange = vi.fn()
    const { container } = render(
      <TokenTextarea name="body" defaultValue={['a']} aria-label="本文" onChange={onChange} />,
    )

    const textbox = screen.getByRole('textbox')

    act(() => {
      textbox.querySelector('div')!.append('b')
      textbox.dispatchEvent(new InputEvent('input', { bubbles: true }))
    })

    expect(onChange).toHaveBeenLastCalledWith(['ab'])
    expect(container.querySelector('input[name="body"]')).toHaveValue('["ab"]')
  })

  it('コピーではトークンを保持したHTMLとラベルに置き換えたテキストを書き込み、貼り付けで復元する', () => {
    render(<TokenTextarea name="body" defaultValue={VALUE} aria-label="本文" />)

    const textbox = screen.getByRole('textbox')
    const lines = textbox.querySelectorAll(':scope > div')
    const copy = createClipboardEvent('copy')

    act(() => {
      textbox.focus()
      document.getSelection()!.setBaseAndExtent(lines[2], 0, lines[2], 3)
      textbox.dispatchEvent(copy.event)
    })

    expect(copy.store['text/plain']).toBe('部署の氏名')

    const paste = createClipboardEvent('paste', copy.store)

    act(() => {
      textbox.dispatchEvent(paste.event)
    })

    expect(paste.event.defaultPrevented).toBe(true)
    expect(document.execCommand).toHaveBeenLastCalledWith(
      'insertHTML',
      false,
      expect.stringMatching(/data-smarthr-ui-token="dept".*の.*data-smarthr-ui-token="name"/),
    )
  })

  it('書式設定の入力は受け付けない', () => {
    render(<TokenTextarea name="body" defaultValue={VALUE} aria-label="本文" />)

    const event = new InputEvent('beforeinput', {
      inputType: 'formatBold',
      bubbles: true,
      cancelable: true,
    })

    screen.getByRole('textbox').dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })

  it('制御コンポーネントとして value の変更を反映する', () => {
    const { rerender } = render(<TokenTextarea name="body" value={['a']} aria-label="本文" />)

    rerender(<TokenTextarea name="body" value={['a', NAME]} aria-label="本文" />)

    expect(screen.getByRole('img', { name: '氏名' })).toBeInTheDocument()
  })

  it('disabled の場合は編集できない', () => {
    render(<TokenTextarea name="body" disabled defaultValue={VALUE} aria-label="本文" />)

    const textbox = screen.getByRole('textbox')

    expect(textbox).toHaveAttribute('contenteditable', 'false')
    expect(textbox).toHaveAttribute('aria-disabled', 'true')
  })
})
