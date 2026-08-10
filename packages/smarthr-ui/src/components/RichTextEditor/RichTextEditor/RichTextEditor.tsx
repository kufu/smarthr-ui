'use client'

import { EditorContent, useEditorState } from '@tiptap/react'
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../../intl'
import { RichTextEditorToolbar } from '../Toolbar/RichTextEditorToolbar'
import { RichTextEditorProvider } from '../context/RichTextEditorContext'
import { ImageFloatingUI } from '../extensions/Image/ImageFloatingUI'
import { TableFloatingUI } from '../extensions/Table/TableFloatingUI'
import { useEditorResize } from '../hooks/useEditorResize'
import { useRichTextEditor } from '../hooks/useRichTextEditor'
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
import type { CSSProperties } from 'react'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-RichTextEditor',
      // box-border は width 指定時に枠線を含めた実寸にするため。
      // Textarea・Input と揃えないと、同じ width を指定しても並べたときに幅がずれる。
      'shr-border-shorthand shr-relative shr-box-border shr-rounded-m',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator--outer',
    ],
    toolbarWrapper: 'shr-sticky shr-top-0 shr-z-1 shr-rounded-t-[inherit] shr-bg-white',
    content: [
      'smarthr-ui-RichTextEditor-content',
      // editor area
      // 高さは content div の CSS 変数から受ける。未指定なら auto に解決されるため、
      // min-h との併用で「下限は常に 8em」が prop でもドラッグでも同じ経路で担保される。
      '[&_.ProseMirror]:shr-h-[var(--shr-rte-editor-height,auto)] [&_.ProseMirror]:shr-min-h-[8em] [&_.ProseMirror]:shr-overflow-y-auto [&_.ProseMirror]:shr-px-0.75 [&_.ProseMirror]:shr-py-0.5 [&_.ProseMirror]:shr-text-base [&_.ProseMirror]:shr-leading-normal [&_.ProseMirror]:shr-text-black [&_.ProseMirror]:shr-outline-none',
      // placeholder
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-text-grey [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-content-[attr(data-placeholder)]',
      // content styles (shared with RichTextViewer)
      ...editorContentClasses,
    ],
    characterCountArea:
      'shr-border-t-shorthand shr-px-0.75 shr-py-0.5 shr-text-right shr-text-sm shr-text-grey',
    resizeHandle: [
      'smarthr-ui-RichTextEditor-resizeHandle',
      // wrapper が shr-relative なので、文字数エリアの有無に関係なく右下に出る。
      // 角丸からはみ出さないよう僅かに内側に寄せる。
      // z-1 は TableFloatingUI / ImageFloatingUI が shr-z-0 で絶対配置されるため。
      'shr-absolute shr-bottom-[2px] shr-right-[2px] shr-z-1',
      'shr-flex shr-items-center shr-justify-center',
      'shr-cursor-ns-resize shr-text-sm shr-text-grey',
      'shr-touch-none',
    ],
  },
  variants: {
    disabled: {
      true: {
        wrapper: 'shr-pointer-events-none shr-border-default/50 shr-bg-white-darken',
        toolbarWrapper: 'shr-bg-white-darken',
        content: '[&_.ProseMirror]:shr-text-disabled',
      },
    },
    readOnly: {
      true: {
        wrapper: '[&&&]:shr-border-[theme(backgroundColor.background)] [&&&]:shr-bg-background',
      },
    },
    error: {
      true: {
        wrapper: 'shr-border-danger',
      },
    },
    resizable: {
      true: {
        // 文字数テキストとハンドルが重ならないよう右側を広げる。
        // shr-px-0.75 を確実に上書きするため、このファイルの既存作法の詳細度引き上げを使う。
        characterCountArea: '[&&&]:shr-pr-2',
      },
    },
    hasEditorHeight: {
      true: {
        // 指定した高さに padding を含めるため。
        // 常時付けてはいけない。preflight 無効で既定が content-box のため、
        // 常時 border-box にすると min-h-[8em] に縦 padding が含まれ、
        // 高さ未指定時のデフォルト高さが 144px から 128px に縮む。
        content: '[&_.ProseMirror]:shr-box-border',
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

      const normalizedDefaultValue = useMemo(() => {
        if (defaultValue) return defaultValue
        if (content) return normalizeToJSON(content)
        return undefined
      }, [defaultValue, content])

      const handleChange = useCallback(
        (nextJson: RichTextJSON, meta: RichTextChangeMeta) => {
          if (!onChange) return
          if (outputFormat === 'html') {
            ;(onChange as (value: string, meta: RichTextChangeMeta) => void)(meta.html, meta)
            return
          }
          ;(onChange as (value: RichTextJSON, meta: RichTextChangeMeta) => void)(nextJson, meta)
        },
        [onChange, outputFormat],
      )

      const { editor } = useRichTextEditor({
        value,
        defaultValue: normalizedDefaultValue,
        onChange: handleChange,
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
          clear: () => editor?.chain().focus().clearContent().run(),
          getJSON: () => (editor?.getJSON() ?? { type: 'doc', content: [] }) as RichTextJSON,
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
          setHeading: (level: 1 | 2 | 3 | 4) =>
            editor?.chain().focus().toggleHeading({ level }).run(),
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
          const ariaInvalid = wrapperEl.getAttribute('aria-invalid')

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

          if (ariaInvalid) {
            proseMirrorEl.setAttribute('aria-invalid', ariaInvalid)
          } else {
            proseMirrorEl.removeAttribute('aria-invalid')
          }
        }

        syncAttributes()

        const observer = new MutationObserver(syncAttributes)
        observer.observe(wrapperEl, {
          attributes: true,
          attributeFilter: ['id', 'aria-describedby', 'aria-invalid'],
        })

        return () => observer.disconnect()
      }, [editor])

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

      useEffect(() => {
        if (!editor || !contentRef.current) return
        const proseMirrorEl = contentRef.current.querySelector<HTMLElement>('.ProseMirror')
        if (!proseMirrorEl) return

        if (error) {
          proseMirrorEl.setAttribute('aria-invalid', 'true')
        } else if (!contentRef.current.getAttribute('aria-invalid')) {
          proseMirrorEl.removeAttribute('aria-invalid')
        }
      }, [editor, error])

      const wrapperStyle = useMemo(
        () => ({ width: typeof width === 'number' ? `${width}px` : width }),
        [width],
      )

      const isResizable = !!resizable && !readOnly && !disabled
      const { draggedHeight, handlePointerDown } = useEditorResize({
        contentRef,
        enabled: isResizable,
      })

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
        error,
        resizable: isResizable,
        hasEditorHeight: contentStyle !== undefined,
      })

      // editorが未初期化でもwrapperは常に描画する
      // FormControlがdata-smarthr-ui-inputを初回mountで発見できるようにするため
      const toolbar = editor && !readOnly && !hideToolbar && (
        <RichTextEditorProvider
          editor={editor}
          features={features}
          headingLevels={headingLevels}
          disabled={disabled}
          onImageUpload={onImageUpload}
          onImageUploadError={onImageUploadError}
          acceptedMimeTypes={acceptedMimeTypes}
        >
          <div ref={toolbarRef} className={classNames.toolbarWrapper()}>
            <RichTextEditorToolbar />
          </div>
        </RichTextEditorProvider>
      )

      return (
        <div ref={wrapperRef} style={wrapperStyle} className={classNames.wrapper({ className })}>
          {toolbar}
          <div
            ref={contentRef}
            data-smarthr-ui-input="true"
            style={contentStyle}
            className={classNames.content({ className: editorClassName })}
          >
            {editor && <EditorContent editor={editor} />}
          </div>
          {editor && !readOnly && !disabled && !hideToolbar && features.includes('table') && (
            <TableFloatingUI editor={editor} containerRef={wrapperRef} />
          )}
          {editor && !readOnly && !disabled && !hideToolbar && features.includes('image') && (
            <ImageFloatingUI editor={editor} containerRef={wrapperRef} />
          )}
          {editor && showCharacterCount && !readOnly && (
            <CharacterCount editor={editor} className={classNames.characterCountArea()} />
          )}
          {isResizable && (
            <div
              className={classNames.resizeHandle()}
              aria-hidden="true"
              onPointerDown={handlePointerDown}
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
  <svg width="1em" height="1em" viewBox="0 0 10 10" focusable="false" aria-hidden="true">
    {/*
      strokeWidth は 1em(13.7px) / viewBox 10 の比率で約1pxになる値。ネイティブの線幅に合わせる。
      斜線は viewBox いっぱいには引かない。掴む領域(1em)は保ったまま、
      描画サイズだけネイティブ(約7px四方)に寄せるため。
    */}
    <path d="M9 3 3 9M9 6 6 9" stroke="currentColor" strokeWidth="0.75" fill="none" />
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
