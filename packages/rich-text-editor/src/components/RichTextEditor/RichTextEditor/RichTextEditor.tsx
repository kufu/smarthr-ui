'use client'

import { EditorContent, useEditorState } from '@tiptap/react'
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { tv } from '../../../libs/tv'
import { RichTextEditorToolbar } from '../Toolbar/RichTextEditorToolbar'
import { RichTextEditorProvider } from '../context/RichTextEditorContext'
import { ImageFloatingUI } from '../extensions/Image/ImageFloatingUI'
import { resetImagePlaceholders } from '../extensions/Image/imageUploadPlaceholder'
import { TableFloatingUI } from '../extensions/Table/TableFloatingUI'
import { YoutubeFloatingUI } from '../extensions/Youtube/YoutubeFloatingUI'
import { useRichTextEditor } from '../hooks/useRichTextEditor'
import { getDetachedJSON } from '../serializers/getDetachedJSON'
import { normalizeToJSON } from '../serializers/normalizeToJSON'
import { serializeToHTML } from '../serializers/serializeToHTML'
import { editorContentClasses } from '../styles'

import type {
  RichTextChangeMeta,
  RichTextEditorController,
  RichTextEditorProps,
  RichTextJSON,
} from '../types'
import type { Editor } from '@tiptap/react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-RichTextEditor',
      // box-border は width 指定時に枠線を含めた実寸にするため。
      // Textarea・Input と揃えないと、同じ width を指定しても並べたときに幅がずれる。
      'shr-rte-border-shorthand shr-rte-relative shr-rte-box-border shr-rte-rounded-m',
      'contrast-more:shr-rte-border-high-contrast',
      'focus-within:shr-rte-focus-indicator--outer',
    ],
    // z は表の操作ハンドル（TableContextMenu が 1〜3 を使う）より上に置く。
    // sticky + z で積み重ねコンテキストを作るため、内側のツールチップの z-overlap は
    // このコンテキストの中でしか効かず、同値だと後ろにあるハンドルに負ける。
    toolbarWrapper:
      'shr-rte-sticky shr-rte-top-0 shr-rte-z-[4] shr-rte-rounded-t-[inherit] shr-rte-bg-white',
    content: [
      'smarthr-ui-RichTextEditor-content',
      // editor area
      // 高さは content div の CSS 変数から受ける。未指定なら auto に解決されるため、
      // min-h との併用で「下限は常に 8em」が prop でもドラッグでも同じ経路で担保される。
      '[&_.ProseMirror]:shr-rte-h-[var(--shr-rte-editor-height,auto)] [&_.ProseMirror]:shr-rte-min-h-[8em] [&_.ProseMirror]:shr-rte-overflow-y-auto [&_.ProseMirror]:shr-rte-px-0.75 [&_.ProseMirror]:shr-rte-py-0.5 [&_.ProseMirror]:shr-rte-text-base [&_.ProseMirror]:shr-rte-leading-normal [&_.ProseMirror]:shr-rte-text-black [&_.ProseMirror]:shr-rte-outline-none',
      // placeholder
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-rte-pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-rte-float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-rte-h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-rte-text-grey [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-rte-content-[attr(data-placeholder)]',
      // content styles (shared with RichTextViewer)
      ...editorContentClasses,
    ],
    characterCountArea:
      'shr-rte-border-t-shorthand shr-rte-px-0.75 shr-rte-py-0.5 shr-rte-text-right shr-rte-text-sm shr-rte-text-grey',
    resizeHandle: [
      'smarthr-ui-RichTextEditor-resizeHandle',
      // wrapper が shr-rte-relative なので、文字数エリアの有無に関係なく右下に出る。
      // 角丸からはみ出さないよう僅かに内側に寄せる。
      // z-1 は TableFloatingUI / ImageFloatingUI / YoutubeFloatingUI が shr-rte-z-0 で絶対配置されるため。
      'shr-rte-absolute shr-rte-bottom-[2px] shr-rte-right-[2px] shr-rte-z-1',
      'shr-rte-flex shr-rte-items-center shr-rte-justify-center',
      'shr-rte-cursor-ns-resize shr-rte-text-sm shr-rte-text-grey',
      'shr-rte-touch-none',
    ],
  },
  variants: {
    disabled: {
      true: {
        wrapper: 'shr-rte-pointer-events-none shr-rte-border-default/50 shr-rte-bg-white-darken',
        toolbarWrapper: 'shr-rte-bg-white-darken',
        content: '[&_.ProseMirror]:shr-rte-text-disabled',
      },
    },
    readOnly: {
      true: {
        wrapper:
          '[&&&]:shr-rte-border-[theme(backgroundColor.background)] [&&&]:shr-rte-bg-background',
      },
    },
    error: {
      true: {
        wrapper: 'shr-rte-border-danger',
      },
    },
    resizable: {
      true: {
        // 文字数テキストとハンドルが重ならないよう右側を広げる。
        // shr-rte-px-0.75 を確実に上書きするため、このファイルの既存作法の詳細度引き上げを使う。
        characterCountArea: '[&&&]:shr-rte-pr-2',
      },
    },
    hasEditorHeight: {
      true: {
        // 指定した高さに padding を含めるため。
        // 常時付けてはいけない。preflight 無効で既定が content-box のため、
        // 常時 border-box にすると min-h-[8em] に縦 padding が含まれ、
        // 高さ未指定時のデフォルト高さが 144px から 128px に縮む。
        content: '[&_.ProseMirror]:shr-rte-box-border',
      },
    },
  },
})

export const RichTextEditor = memo(
  forwardRef<RichTextEditorController, RichTextEditorProps>(
    (
      {
        content,
        value,
        defaultValue,
        outputFormat,
        onChange,
        onFocus,
        onBlur,
        features = ['bold', 'italic', 'bulletList', 'orderedList', 'link'] as const,
        headingLevels,
        hideToolbar,
        disabled,
        readOnly,
        error,
        placeholder,
        showCharacterCount,
        className,
        editorClassName,
        width,
        height,
        resizable,
        onImageUpload,
        onImageUploadError,
        acceptedMimeTypes,
      }: RichTextEditorProps,
      ref,
    ) => {
      const wrapperRef = useRef<HTMLDivElement>(null)
      const toolbarRef = useRef<HTMLDivElement>(null)
      const contentRef = useRef<HTMLDivElement>(null)
      // FormControl は errorMessages を wrapper の aria-invalid で伝えてくる。
      // 見た目もそれに追従させるため state に持つ
      const [formControlInvalid, setFormControlInvalid] = useState(false)
      const [draggedHeight, setDraggedHeight] = useState<number | null>(null)
      // ドラッグ中の起点。state にすると pointermove ごとに購読し直す必要があるため ref に置く
      const dragOriginRef = useRef<{ clientY: number; height: number; minHeight: number } | null>(
        null,
      )
      const isResizable = !!resizable && !readOnly && !disabled

      const normalizedDefaultValue = useMemo(() => {
        if (defaultValue) return defaultValue
        if (content) return normalizeToJSON(content)
        return undefined
      }, [defaultValue, content])

      const latest = useLatest({ onChange, outputFormat, draggedHeight })

      const functions = useMemo(
        () => ({
          handleChange: (nextJson: RichTextJSON, meta: RichTextChangeMeta) => {
            if (!latest.onChange) return
            if (latest.outputFormat === 'html') {
              ;(latest.onChange as (value: string, meta: RichTextChangeMeta) => void)(
                meta.html,
                meta,
              )
              return
            }
            ;(latest.onChange as (value: RichTextJSON, meta: RichTextChangeMeta) => void)(
              nextJson,
              meta,
            )
          },
          handleResizePointerDown: (e: ReactPointerEvent) => {
            // 右クリックはコンテキストメニューが開き、pointerup が届かないままドラッグが残る
            if (e.button !== 0) return

            const proseMirror = contentRef.current?.querySelector<HTMLElement>('.ProseMirror')

            if (!proseMirror) return

            // ドラッグ中に本文のテキストが選択されるのを防ぐ
            e.preventDefault()

            dragOriginRef.current = {
              clientY: e.clientY,
              height: latest.draggedHeight ?? proseMirror.getBoundingClientRect().height,
              // 下限は CSS の min-height を正とする。px を直書きするとトークンと二重管理になるため
              minHeight: parseFloat(getComputedStyle(proseMirror).minHeight) || 0,
            }
          },
        }),
        [latest],
      )

      // setPointerCapture ではなく window で受ける。ハンドルの外にポインタが出ても
      // 追従させる必要があり、かつ jsdom が setPointerCapture を実装していないため。
      useEffect(() => {
        if (!isResizable) return

        const handleMove = (e: PointerEvent) => {
          const origin = dragOriginRef.current

          if (origin) {
            // CSS の min-height でも見た目は止まるが、保持値が下限を下回ると
            // 次のドラッグの起点がずれて「動かしても変わらない」状態になるためここでも止める
            setDraggedHeight(
              Math.max(origin.minHeight, origin.height + (e.clientY - origin.clientY)),
            )
          }
        }

        const handleUp = () => {
          dragOriginRef.current = null
        }

        window.addEventListener('pointermove', handleMove)
        window.addEventListener('pointerup', handleUp)
        window.addEventListener('pointercancel', handleUp)

        return () => {
          window.removeEventListener('pointermove', handleMove)
          window.removeEventListener('pointerup', handleUp)
          window.removeEventListener('pointercancel', handleUp)
          // ドラッグ中に readOnly/disabled へ切り替わったら、そのドラッグは打ち切る
          dragOriginRef.current = null
        }
      }, [isResizable])

      const { editor } = useRichTextEditor({
        value,
        defaultValue: normalizedDefaultValue,
        onChange: onChange ? functions.handleChange : undefined,
        onImageUpload,
        onImageUploadError,
        acceptedMimeTypes,
        onFocus,
        onBlur,
        features,
        headingLevels,
        disabled,
        readOnly,
        placeholder,
        toolbarRef,
      })

      useImperativeHandle(
        ref,
        () => ({
          focus: () => editor?.chain().focus().run(),
          clear: () =>
            editor
              ?.chain()
              .focus()
              .clearContent()
              .command(({ tr }) => {
                resetImagePlaceholders(tr)

                return true
              })
              .run(),
          getJSON: () => (editor ? getDetachedJSON(editor) : { type: 'doc', content: [] }),
          // editor.getHTML() は拡張の renderHTML をそのまま使うためサニタイズされない。
          // onChange の meta.html と同じ結果を返すよう共通シリアライザーを通す。
          getHTML: () => (editor ? serializeToHTML(editor.getJSON()) : ''),
          getText: () => editor?.getText() ?? '',
          isEmpty: () => editor?.isEmpty ?? true,
          toggleBold: () => editor?.chain().focus().toggleBold().run(),
          toggleItalic: () => editor?.chain().focus().toggleItalic().run(),
          toggleBulletList: () => editor?.chain().focus().toggleBulletList().run(),
          toggleOrderedList: () => editor?.chain().focus().toggleOrderedList().run(),
          toggleBlockquote: () => editor?.chain().focus().toggleBlockquote().run(),
          setHeading: (level: 1 | 2 | 3 | 4) => editor?.chain().focus().setHeading({ level }).run(),
          setLink: (href: string) =>
            editor?.chain().focus().extendMarkRange('link').setLink({ href }).run(),
          unsetLink: () => editor?.chain().focus().extendMarkRange('link').unsetLink().run(),
        }),
        [editor],
      )

      // FormControlとの連携:
      // content wrapper divにdata-smarthr-ui-inputを静的に付与し、
      // FormControlがuseEffectでid/aria-describedbyを付与する。
      // MutationObserverでwrapperの属性変更を監視し、ProseMirror divに転写する。
      useEffect(() => {
        if (!editor || !contentRef.current) return

        const wrapperEl = contentRef.current
        const proseMirrorEl = wrapperEl.querySelector<HTMLElement>('.ProseMirror')
        if (!proseMirrorEl) return

        proseMirrorEl.setAttribute('role', 'textbox')
        proseMirrorEl.setAttribute('aria-multiline', 'true')

        const syncAttributes = () => {
          const id = wrapperEl.getAttribute('id')
          const describedBy = wrapperEl.getAttribute('aria-describedby')
          // FormControl が出すのは 'true' のみ。'false' を真と読むと常にエラー表示になる
          const externalInvalid = wrapperEl.getAttribute('aria-invalid')
          const invalidFromFormControl = externalInvalid === 'true'

          setFormControlInvalid(invalidFromFormControl)

          if (id) {
            proseMirrorEl.setAttribute('id', id)
            wrapperEl.removeAttribute('id')

            const label = document.querySelector<HTMLElement>(`label[for="${id}"]`)
            if (label?.id) {
              proseMirrorEl.setAttribute('aria-labelledby', label.id)
            } else {
              proseMirrorEl.removeAttribute('aria-labelledby')
            }
          }

          if (describedBy) {
            proseMirrorEl.setAttribute('aria-describedby', describedBy)
          } else {
            proseMirrorEl.removeAttribute('aria-describedby')
          }

          // grammar / spelling は「文法・綴りの誤り」を表す別の値なので、
          // error が立っていないときは潰さずそのまま通す
          const keptInvalid =
            externalInvalid === 'grammar' || externalInvalid === 'spelling' ? externalInvalid : null
          const ariaInvalid = error || invalidFromFormControl ? 'true' : keptInvalid

          if (ariaInvalid) {
            proseMirrorEl.setAttribute('aria-invalid', ariaInvalid)
          } else {
            proseMirrorEl.removeAttribute('aria-invalid')
          }
        }

        // label の for が指すのは div なので、ブラウザはクリックでフォーカスを移してくれない。
        // 委譲で拾い、for が本文の id と一致するものだけ処理する
        const handleLabelClick = (e: MouseEvent) => {
          const target = e.target as HTMLElement | null
          const label = target?.closest('label')
          const id = proseMirrorEl.getAttribute('id')

          const isOwnLabel = !!label && !!id && label.htmlFor === id
          // ラベルの中のリンクやボタンは、それ自体の操作が優先される
          const hitsInteractive = !!target?.closest('a, button, input, select, textarea')

          if (isOwnLabel && !hitsInteractive && editor.isEditable) {
            e.preventDefault()
            editor.commands.focus()
          }
        }

        syncAttributes()

        const observer = new MutationObserver(syncAttributes)
        observer.observe(wrapperEl, {
          attributes: true,
          attributeFilter: ['id', 'aria-describedby', 'aria-invalid'],
        })
        document.addEventListener('click', handleLabelClick)

        return () => {
          observer.disconnect()
          document.removeEventListener('click', handleLabelClick)
        }
      }, [editor, error])

      // disabled/readOnlyはどちらも本文がcontenteditable="false"になるだけで区別が付かない。
      // role="textbox"を明示している以上、対応する状態も明示しないと支援技術に伝わらない。
      // 値false（aria-disabled="false"）ではなく属性ごと外すのは、ariaの既定値がfalseであり
      // 「未指定」と同義のため。
      useEffect(() => {
        if (!editor || !contentRef.current) return
        const proseMirrorEl = contentRef.current.querySelector<HTMLElement>('.ProseMirror')
        if (!proseMirrorEl) return

        const toggleAriaState = (name: string, isOn: boolean | undefined) => {
          if (isOn) {
            proseMirrorEl.setAttribute(name, 'true')
          } else {
            proseMirrorEl.removeAttribute(name)
          }
        }

        toggleAriaState('aria-disabled', disabled)
        toggleAriaState('aria-readonly', readOnly)
      }, [editor, disabled, readOnly])

      const wrapperStyle = useMemo(
        () => ({ width: typeof width === 'number' ? `${width}px` : width }),
        [width],
      )

      const contentStyle = useMemo(() => {
        const editorHeight =
          draggedHeight !== null
            ? `${draggedHeight}px`
            : typeof height === 'number'
              ? `${height}px`
              : height

        if (editorHeight === undefined) return undefined

        return { '--shr-rte-editor-height': editorHeight } as CSSProperties
      }, [draggedHeight, height])

      const classNames = classNameGenerator({
        disabled,
        readOnly,
        error: error || formControlInvalid,
        resizable: isResizable,
        hasEditorHeight: contentStyle !== undefined,
      })

      // editorが未初期化でもwrapperは常に描画する
      // FormControlがdata-smarthr-ui-inputを初回mountで発見できるようにするため
      const toolbar = editor && !readOnly && !hideToolbar && (
        <RichTextEditorProvider
          disabled={disabled}
          editor={editor}
          features={features}
          headingLevels={headingLevels}
          acceptedMimeTypes={acceptedMimeTypes}
          onImageUpload={onImageUpload}
          onImageUploadError={onImageUploadError}
        >
          <div ref={toolbarRef} className={classNames.toolbarWrapper()}>
            <RichTextEditorToolbar />
          </div>
        </RichTextEditorProvider>
      )

      return (
        <div ref={wrapperRef} className={classNames.wrapper({ className })} style={wrapperStyle}>
          {toolbar}
          <div
            ref={contentRef}
            className={classNames.content({ className: editorClassName })}
            style={contentStyle}
            data-smarthr-ui-input="true"
          >
            {editor && <EditorContent editor={editor} />}
          </div>
          {editor && !readOnly && !disabled && !hideToolbar && features.includes('table') && (
            <TableFloatingUI containerRef={wrapperRef} features={features} editor={editor} />
          )}
          {editor && !readOnly && !disabled && !hideToolbar && features.includes('image') && (
            <ImageFloatingUI containerRef={wrapperRef} editor={editor} />
          )}
          {editor && !readOnly && !disabled && !hideToolbar && features.includes('youtube') && (
            <YoutubeFloatingUI containerRef={wrapperRef} editor={editor} />
          )}
          {editor && showCharacterCount && !readOnly && (
            <CharacterCount editor={editor} className={classNames.characterCountArea()} />
          )}
          {isResizable && (
            <div
              className={classNames.resizeHandle()}
              aria-hidden="true"
              onPointerDown={functions.handleResizePointerDown}
            >
              <ResizeHandleGrip />
            </div>
          )}
        </div>
      )
    },
  ),
)

/**
 * ネイティブの textarea のリサイズハンドルと同じ斜線グリップ。
 *
 * Icon コンポーネントを使わないのは、Font Awesome に斜線グリップのアイコンが無いため。
 * 近い FaUpRightAndDownLeftFromCenterIcon は斜めの双方向矢印で見た目が別物になる。
 * ブラウザ標準の resize に任せる方法も採らなかった。resize は overflow が visible 以外の
 * 要素にしか効かず、wrapper に overflow を付けるとツールバーの sticky がページ追従しなくなり、
 * wrapper 内に絶対配置しているテーブルの「+列」バーも clip されるため。
 */
const ResizeHandleGrip = () => (
  <svg viewBox="0 0 10 10" focusable="false" width="1em" height="1em" aria-hidden="true">
    {/*
      strokeWidth は 1em(13.7px) / viewBox 10 の比率で約1pxになる値。ネイティブの線幅に合わせる。
      斜線は viewBox いっぱいには引かない。掴む領域(1em)は保ったまま、
      描画サイズだけネイティブ(約7px四方)に寄せるため。
    */}
    <path d="M9 3 3 9M9 6 6 9" stroke="currentColor" fill="none" strokeWidth="0.75" />
  </svg>
)

const CharacterCount = memo(({ editor, className }: { editor: Editor; className: string }) => {
  const { localize } = useIntl()

  const count = useEditorState({
    editor,
    selector: ({ editor: e }) => e.getText({ blockSeparator: '' }).length,
  })

  return (
    <div className={className}>
      {localize(
        { id: 'smarthr-ui/RichTextEditor/characterCount', defaultText: '文字数：{count}' },
        { count },
      )}
    </div>
  )
})
