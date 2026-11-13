'use client'

import {
  type FC,
  type ReactNode,
  type Ref,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'
import { Chip } from '../../../Chip'

import {
  TOKEN_SELECTOR,
  type TokenTextareaSegment,
  type TokenTextareaToken,
  isSameValue,
  normalizeValue,
  readClipboard,
  readToken,
  readValue,
  toHtml,
  toInlineHtml,
  toPlainText,
} from './editor'

import type { ExtendElementPropsWithoutRef } from '../../../../types'

type TokenTextareaValue = TokenTextareaSegment[]

export type TokenTextareaHandle = {
  /** 編集領域の要素 */
  element: HTMLDivElement | null
  /** 編集領域にフォーカスする。キャレットは最後に操作していた位置に戻る */
  focus: () => void
  /**
   * 最後にキャレットがあった位置にトークンを挿入する。選択範囲があればトークンで置き換える。
   * ボタンのクリックなどで編集領域からフォーカスが外れていても、直前の位置に挿入される
   */
  insertToken: (token: TokenTextareaToken) => void
  /** 最後にキャレットがあった位置にテキストを挿入する */
  insertText: (text: string) => void
}

type Props = ExtendElementPropsWithoutRef<
  'div',
  {
    /** 値。文字列とトークンの配列 */
    value?: TokenTextareaValue
    /** 非制御で使う場合の初期値 */
    defaultValue?: TokenTextareaValue
    /** 値が変わった時に呼ばれる */
    onChange?: (value: TokenTextareaValue) => void
    /**
     * トークンの見た目。省略した場合は Chip で label を表示する。
     * 見た目はクリックなどの操作を受け付けない。読み上げには label が使われる
     */
    renderToken?: (token: TokenTextareaToken) => ReactNode
    /** 入力値にエラーがあるかどうか */
    error?: boolean
    /** 入力できない状態にするかどうか */
    disabled?: boolean
    /** コンポーネントの幅 */
    width?: number | string
    /** 最小の行数。省略した場合は2 */
    rows?: number
    /** 最大行数。超えるとスクロールする。初期値は無限 */
    maxRows?: number
    /** 自動でフォーカスされるかどうか */
    autoFocus?: boolean
    /** フォームで送信する際の名前。値は JSON 文字列として送信される */
    name?: string
    ref?: Ref<TokenTextareaHandle>
  }
>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-TokenTextarea',
      'shr-border-shorthand shr-relative shr-box-border shr-block shr-overflow-y-auto shr-rounded-m shr-bg-white shr-text-base shr-leading-normal shr-text-black',
      'contrast-more:shr-border-high-contrast',
      'has-[[contenteditable]:focus-visible]:shr-focus-indicator',
      'has-[[aria-disabled=true]]:shr-bg-column has-[[aria-disabled=true]]:shr-text-disabled',
      'has-[[aria-invalid]]:shr-border-danger',
      // HINT: border(上下1pxずつ) と padding(上下 0.5 ずつ) を含めた高さにする
      'shr-min-h-[calc(var(--smarthr-ui-token-textarea-rows)*1lh+theme(spacing.1)+2px)]',
      'shr-max-h-[calc(var(--smarthr-ui-token-textarea-max-rows,infinity)*1lh+theme(spacing.1)+2px)]',
    ],
    // HINT: 見た目は編集領域の背面に描く。キャレットと選択範囲は前面の編集領域に描かれる
    layer: 'shr-pointer-events-none shr-absolute shr-left-0 shr-top-0',
    tokenVisual: 'shr-absolute shr-inline-flex shr-whitespace-nowrap',
    editor: [
      'shr-relative shr-whitespace-pre-wrap shr-break-words shr-p-0.5 shr-outline-none',
      'shr-text-base shr-leading-normal shr-text-black',
      'aria-[disabled=true]:shr-pointer-events-none',
      // HINT: トークン(透明な画像)を見た目と同じ大きさにし、前後の文字と少し離す
      '[&_img]:shr-mx-[2px] [&_img]:shr-align-middle',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { layer, tokenVisual, editor } = classNameGenerator()

  return { layer: layer(), tokenVisual: tokenVisual(), editor: editor() }
})()

const defaultRenderToken = (token: TokenTextareaToken) => <Chip>{token.label}</Chip>

type TokenItem = { key: number; token: TokenTextareaToken; image: HTMLImageElement }

/** 編集操作をブラウザ標準の undo 履歴に載せるため、execCommand で行う */
const execEditCommand = (command: 'insertHTML' | 'insertText' | 'delete', value?: string) =>
  document.execCommand(command, false, value)

export const TokenTextarea: FC<Props> = ({
  value,
  defaultValue,
  onChange,
  renderToken = defaultRenderToken,
  error,
  disabled,
  width,
  rows = 2,
  maxRows = Infinity,
  autoFocus,
  name,
  className,
  style,
  ref,
  ...rest
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const visualRefs = useRef(new Map<number, HTMLElement>())
  const stateRef = useRef<{
    value: TokenTextareaValue
    composing: boolean
    /** 最後に編集領域内にあった選択範囲。フォーカスが外れた後の挿入位置に使う */
    range: Range | null
    keys: WeakMap<HTMLImageElement, number>
    nextKey: number
  }>({ value: [], composing: false, range: null, keys: new WeakMap(), nextKey: 0 })
  const [items, setItems] = useState<TokenItem[]>([])

  const classNames = useMemo(() => {
    const { wrapper } = classNameGenerator()

    return { wrapper: wrapper({ className }) }
  }, [className])

  const latest = useLatest({ value, defaultValue, onChange, autoFocus, disabled, items })

  const functions = useMemo(() => {
    const getEditor = () => editorRef.current

    const updateHiddenInput = (nextValue: TokenTextareaValue) => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = JSON.stringify(nextValue)
      }
    }

    /** トークンの画像を見た目と同じ大きさにし、見た目を画像の位置へ移動する */
    const layoutTokens = () => {
      const wrapper = wrapperRef.current

      if (!wrapper) {
        return
      }

      // 先に全ての大きさを確定させてから位置を読む(読み書きを交互にするとレイアウトが何度も走る)
      for (const { key, image } of latest.items) {
        const visual = visualRefs.current.get(key)

        if (visual) {
          // HINT: 小数点以下まで合わせるため、width/height 属性(整数)ではなく style で指定する
          const rect = visual.getBoundingClientRect()

          image.style.width = `${rect.width}px`
          image.style.height = `${rect.height}px`
        }
      }

      const base = wrapper.getBoundingClientRect()
      const left = wrapper.scrollLeft - base.left - wrapper.clientLeft
      const top = wrapper.scrollTop - base.top - wrapper.clientTop

      for (const { key, image } of latest.items) {
        const visual = visualRefs.current.get(key)

        if (visual) {
          const rect = image.getBoundingClientRect()

          visual.style.transform = `translate(${rect.left + left}px, ${rect.top + top}px)`
        }
      }
    }

    /** 編集領域のトークンの画像を集め、背面に描く見た目と対応付ける */
    const collectTokens = () => {
      const editor = getEditor()

      if (!editor) {
        return
      }

      const state = stateRef.current
      const nextItems = Array.from(editor.querySelectorAll<HTMLImageElement>(TOKEN_SELECTOR)).map(
        (image) => {
          let key = state.keys.get(image)

          if (key === undefined) {
            key = state.nextKey++
            state.keys.set(image, key)
          }

          return { key, token: readToken(image), image }
        },
      )

      // HINT: 画像の大きさが決まる前に描画されないよう、同期的に見た目を描画して大きさを合わせる
      flushSync(() => setItems(nextItems))
      layoutTokens()
    }

    const emitChange = () => {
      const editor = getEditor()
      const state = stateRef.current

      if (!editor || state.composing) {
        return
      }

      const nextValue = readValue(editor)

      if (!isSameValue(nextValue, state.value)) {
        state.value = nextValue
        updateHiddenInput(nextValue)
        latest.onChange?.(nextValue)
      }
    }

    const render = (nextValue: TokenTextareaValue) => {
      const editor = getEditor()

      if (editor) {
        editor.innerHTML = toHtml(nextValue)
        stateRef.current.value = normalizeValue(nextValue)
        updateHiddenInput(stateRef.current.value)
      }
    }

    /** 最後の選択範囲に挿入する。ブラウザ標準の undo で取り消せる */
    const insert = (insertValue: TokenTextareaValue) => {
      const editor = getEditor()

      if (!editor || latest.disabled) {
        return
      }

      const selection = document.getSelection()
      const { range } = stateRef.current

      editor.focus({ preventScroll: true })

      if (selection) {
        if (range && editor.contains(range.startContainer)) {
          selection.removeAllRanges()
          selection.addRange(range)
        } else if (!selection.anchorNode || !editor.contains(selection.anchorNode)) {
          selection.selectAllChildren(editor)
          selection.collapseToEnd()
        }
      }

      const normalized = normalizeValue(insertValue)

      if (normalized.length === 0) {
        execEditCommand('delete')

        return
      }

      execEditCommand(
        'insertHTML',
        normalized.some((segment) => typeof segment === 'string' && segment.includes('\n'))
          ? toHtml(normalized)
          : toInlineHtml(normalized),
      )
    }

    return {
      render,
      collectTokens,
      layoutTokens,
      emitChange,
      insert,
      focus: () => {
        const editor = getEditor()
        const { range } = stateRef.current

        editor?.focus({ preventScroll: false })

        if (editor && range && editor.contains(range.startContainer)) {
          document.getSelection()?.removeAllRanges()
          document.getSelection()?.addRange(range)
        }
      },
      callbackRef: (editor: HTMLDivElement | null) => {
        if (!editor) {
          return
        }

        const state = stateRef.current
        const doc = editor.ownerDocument

        // HINT: font-size が rem などの相対値だと、行の結合時などにブラウザが書式を保とうとして
        // <span style="font-size: 1rem"> を挿入してしまう。px の絶対値を編集領域自身に指定すると挿入されない
        editor.style.fontSize = getComputedStyle(editor).fontSize

        render(latest.value ?? latest.defaultValue ?? [])
        collectTokens()

        if (latest.autoFocus) {
          editor.focus()
        }

        const handleBeforeInput = (e: InputEvent) => {
          // 太字などの書式設定は受け付けない
          if (latest.disabled || e.inputType.startsWith('format')) {
            e.preventDefault()
          }
        }
        const handleInput = (e: Event) => {
          if (!(e as InputEvent).isComposing) {
            emitChange()
          }
        }
        const handleCompositionStart = () => {
          state.composing = true
        }
        const handleCompositionEnd = () => {
          state.composing = false
          emitChange()
        }
        const handleSelectionChange = () => {
          const selection = doc.getSelection()

          if (selection?.rangeCount && editor.contains(selection.getRangeAt(0).startContainer)) {
            state.range = selection.getRangeAt(0).cloneRange()
          }
        }
        const writeClipboard = (e: ClipboardEvent) => {
          const selection = doc.getSelection()

          if (!selection?.rangeCount || selection.isCollapsed || !e.clipboardData) {
            return false
          }

          const fragment = readValue(selection.getRangeAt(0).cloneContents())

          e.preventDefault()
          e.clipboardData.setData('text/plain', toPlainText(fragment))
          e.clipboardData.setData('text/html', toHtml(fragment))

          return true
        }
        const handleCopy = (e: ClipboardEvent) => {
          writeClipboard(e)
        }
        const handleCut = (e: ClipboardEvent) => {
          if (!latest.disabled && writeClipboard(e)) {
            execEditCommand('delete')
          }
        }
        const handlePaste = (e: ClipboardEvent) => {
          e.preventDefault()

          const pasted = readClipboard(e.clipboardData)

          if (pasted) {
            insert(pasted)
          }
        }
        // HINT: Safari は編集領域内の画像をクリックすると選択範囲が消えるため、クリックした側にキャレットを置く
        const handleMouseDown = (e: MouseEvent) => {
          const image = e.target instanceof Element ? e.target.closest(TOKEN_SELECTOR) : null

          if (!image || !image.parentNode || e.button !== 0 || latest.disabled) {
            return
          }

          e.preventDefault()
          editor.focus({ preventScroll: true })

          const rect = image.getBoundingClientRect()
          const index = Array.prototype.indexOf.call(image.parentNode.childNodes, image)
          const offset = e.clientX > rect.left + rect.width / 2 ? index + 1 : index
          const selection = doc.getSelection()

          if (e.shiftKey) {
            selection?.extend(image.parentNode, offset)
          } else {
            selection?.collapse(image.parentNode, offset)
          }
        }

        // HINT: 編集によってトークンの増減や位置の変化が起きるため、DOM と大きさの変化を監視して見た目を追従させる
        const mutationObserver = new MutationObserver(collectTokens)
        const resizeObserver = new ResizeObserver(() => latest.items.length > 0 && layoutTokens())

        mutationObserver.observe(editor, { childList: true, subtree: true, characterData: true })
        resizeObserver.observe(editor)
        doc.fonts?.addEventListener('loadingdone', layoutTokens)

        editor.addEventListener('beforeinput', handleBeforeInput)
        editor.addEventListener('input', handleInput)
        editor.addEventListener('compositionstart', handleCompositionStart)
        editor.addEventListener('compositionend', handleCompositionEnd)
        editor.addEventListener('copy', handleCopy)
        editor.addEventListener('cut', handleCut)
        editor.addEventListener('paste', handlePaste)
        editor.addEventListener('mousedown', handleMouseDown)
        doc.addEventListener('selectionchange', handleSelectionChange)

        return () => {
          mutationObserver.disconnect()
          resizeObserver.disconnect()
          doc.fonts?.removeEventListener('loadingdone', layoutTokens)
          editor.removeEventListener('beforeinput', handleBeforeInput)
          editor.removeEventListener('input', handleInput)
          editor.removeEventListener('compositionstart', handleCompositionStart)
          editor.removeEventListener('compositionend', handleCompositionEnd)
          editor.removeEventListener('copy', handleCopy)
          editor.removeEventListener('cut', handleCut)
          editor.removeEventListener('paste', handlePaste)
          editor.removeEventListener('mousedown', handleMouseDown)
          doc.removeEventListener('selectionchange', handleSelectionChange)
        }
      },
    }
  }, [latest])

  // 制御コンポーネントとして使う場合、外から渡された値が現在の値と異なれば描画し直す
  useEffect(() => {
    if (value !== undefined && !isSameValue(value, stateRef.current.value)) {
      functions.render(value)
    }
  }, [value, functions])

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return editorRef.current
      },
      focus: functions.focus,
      insertToken: (token: TokenTextareaToken) => functions.insert([token]),
      insertText: (text: string) => functions.insert([text]),
    }),
    [functions],
  )

  const mergedRef = useMergeRefs(editorRef, functions.callbackRef)

  return (
    <div
      ref={wrapperRef}
      className={classNames.wrapper}
      style={{
        ...style,
        width: typeof width === 'number' ? `${width}px` : width,
        ['--smarthr-ui-token-textarea-rows' as string]: rows,
        ['--smarthr-ui-token-textarea-max-rows' as string]:
          maxRows === Infinity ? undefined : maxRows,
      }}
    >
      <div className={CLASS_NAMES.layer} aria-hidden="true">
        {items.map(({ key, token }) => (
          <span
            key={key}
            ref={(element) => {
              if (element) {
                visualRefs.current.set(key, element)
              } else {
                visualRefs.current.delete(key)
              }
            }}
            className={CLASS_NAMES.tokenVisual}
          >
            {renderToken(token)}
          </span>
        ))}
      </div>
      <div
        {...rest}
        ref={mergedRef}
        role="textbox"
        contentEditable={!disabled}
        suppressContentEditableWarning
        tabIndex={disabled ? -1 : undefined}
        className={CLASS_NAMES.editor}
        aria-multiline="true"
        aria-invalid={error || undefined}
        aria-disabled={disabled || undefined}
        data-smarthr-ui-input-error={error || undefined}
        data-smarthr-ui-input="true"
      />
      {name && <input ref={hiddenInputRef} type="hidden" name={name} />}
    </div>
  )
}
