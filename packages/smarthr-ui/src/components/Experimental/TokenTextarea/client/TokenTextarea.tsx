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
  verifyTokens,
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
    /**
     * 貼り付けやドロップで受け入れるトークン。value が一致するものだけをトークンとして取り込み、label はこちらの値を使う。
     * 一覧にないトークンはラベルの文字列として取り込む。
     * 省略した場合、同じページの TokenTextarea でコピー・ドラッグしたもの以外のトークンは全て文字列として取り込む
     */
    tokens?: TokenTextareaToken[]
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
const getRangeFromPoint = (doc: Document, x: number, y: number) => {
  if (typeof doc.caretPositionFromPoint === 'function') {
    const position = doc.caretPositionFromPoint(x, y)

    if (!position) {
      return null
    }

    const range = doc.createRange()

    range.setStart(position.offsetNode, position.offset)

    return range
  }

  // caretPositionFromPoint を持たないブラウザ(古い Safari など)向け
  return typeof doc.caretRangeFromPoint === 'function' ? doc.caretRangeFromPoint(x, y) : null
}

/**
 * 同じページの TokenTextarea で最後にコピー・ドラッグした値。
 * 貼り付けられた値がこれと一致する場合のみ、トークンを検証せずに信頼する
 */
let lastExportedValue: TokenTextareaValue | null = null

const execEditCommand = (command: 'insertHTML' | 'insertText' | 'delete', value?: string) =>
  document.execCommand(command, false, value)

export const TokenTextarea: FC<Props> = ({
  value,
  defaultValue,
  onChange,
  renderToken = defaultRenderToken,
  tokens,
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
    /** この編集領域の中からドラッグしているか。編集領域内での移動はブラウザ標準の挙動に任せる */
    draggingInside: boolean
  }>({
    value: [],
    composing: false,
    range: null,
    keys: new WeakMap(),
    nextKey: 0,
    draggingInside: false,
  })
  const [items, setItems] = useState<TokenItem[]>([])

  const classNames = useMemo(() => {
    const { wrapper } = classNameGenerator()

    return { wrapper: wrapper({ className }) }
  }, [className])

  const latest = useLatest({ value, defaultValue, onChange, tokens, autoFocus, disabled, items })

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

    /** 指定した範囲(省略時は最後の選択範囲)に挿入する。ブラウザ標準の undo で取り消せる */
    const insert = (insertValue: TokenTextareaValue, target?: Range | null) => {
      const editor = getEditor()

      if (!editor || latest.disabled) {
        return
      }

      const selection = document.getSelection()

      editor.focus({ preventScroll: true })

      if (selection) {
        const range = target ?? stateRef.current.range

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

    /** クリップボードやドロップで外部から来た内容を、検証済みの値として読み取る */
    const importData = (data: DataTransfer | null) => {
      const imported = readClipboard(data)

      if (!imported) {
        return null
      }

      const trusted = lastExportedValue !== null && isSameValue(imported, lastExportedValue)

      return verifyTokens(imported, latest.tokens, trusted)
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
          // 太字などの書式設定やリンクの挿入は受け付けない
          if (latest.disabled || e.inputType.startsWith('format') || e.inputType === 'insertLink') {
            e.preventDefault()

            return
          }

          // HINT: paste イベントを経由しない貼り付け(引用として貼り付け、作文ツールによる置き換えなど)で
          // HTML やファイルが持ち込まれる場合も、貼り付けと同じく検証した値として挿入する。
          // 編集領域内でのドラッグによる移動は、自身の内容なのでブラウザ標準の挙動に任せる
          const data = e.dataTransfer

          if (
            !data ||
            (e.inputType === 'insertFromDrop' && state.draggingInside) ||
            !(data.types.includes('text/html') || data.types.includes('Files'))
          ) {
            return
          }

          e.preventDefault()

          const [targetRange] = e.getTargetRanges()
          const range = targetRange ? doc.createRange() : null

          if (range && targetRange) {
            range.setStart(targetRange.startContainer, targetRange.startOffset)
            range.setEnd(targetRange.endContainer, targetRange.endOffset)
          }

          const imported = importData(data)

          if (imported) {
            insert(imported, range)
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
        const exportSelection = (data: DataTransfer, selection: Selection) => {
          const fragment = readValue(selection.getRangeAt(0).cloneContents())

          data.setData('text/plain', toPlainText(fragment))
          data.setData('text/html', toHtml(fragment))
          lastExportedValue = fragment
        }
        const writeClipboard = (e: ClipboardEvent) => {
          const selection = doc.getSelection()

          if (!selection?.rangeCount || selection.isCollapsed || !e.clipboardData) {
            return false
          }

          e.preventDefault()
          exportSelection(e.clipboardData, selection)

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

          const pasted = importData(e.clipboardData)

          if (pasted) {
            insert(pasted)
          }
        }
        const handleDragStart = (e: DragEvent) => {
          const selection = doc.getSelection()

          state.draggingInside = true

          // HINT: ドラッグする内容もコピーと同じ形式にし、他の TokenTextarea へドロップした際にトークンを保てるようにする
          if (selection?.rangeCount && !selection.isCollapsed && e.dataTransfer) {
            exportSelection(e.dataTransfer, selection)
          }
        }
        const handleDragEnd = () => {
          state.draggingInside = false
        }
        // HINT: 外部からのドロップはブラウザ標準のままだと HTML が DOM にそのまま入るため、
        // 貼り付けと同じく検証した値としてドロップ位置に挿入する
        const handleDrop = (e: DragEvent) => {
          if (state.draggingInside) {
            return
          }

          e.preventDefault()

          if (latest.disabled) {
            return
          }

          const imported = importData(e.dataTransfer)

          if (imported) {
            const range = getRangeFromPoint(doc, e.clientX, e.clientY)

            insert(imported, range && editor.contains(range.startContainer) ? range : null)
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
        editor.addEventListener('dragstart', handleDragStart)
        editor.addEventListener('dragend', handleDragEnd)
        editor.addEventListener('drop', handleDrop)
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
          editor.removeEventListener('dragstart', handleDragStart)
          editor.removeEventListener('dragend', handleDragEnd)
          editor.removeEventListener('drop', handleDrop)
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
