'use client'

import { EditorContent } from '@tiptap/react'
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

import { RichTextEditorToolbar } from '../Toolbar/RichTextEditorToolbar'
import { RichTextEditorProvider } from '../context/RichTextEditorContext'
import { useRichTextEditor } from '../hooks/useRichTextEditor'
import { normalizeToJSON } from '../serializers/normalizeToJSON'
import { editorContentClasses } from '../styles'

import type {
  RichTextChangeMeta,
  RichTextEditorController,
  RichTextEditorProps,
  RichTextJSON,
} from '../types'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-RichTextEditor',
      'shr-border-shorthand shr-rounded-m',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator--outer',
    ],
    toolbarWrapper: 'shr-sticky shr-top-0 shr-rounded-t-[inherit] shr-bg-white',
    content: [
      'smarthr-ui-RichTextEditor-content',
      // editor area
      '[&_.ProseMirror]:shr-min-h-[8em] [&_.ProseMirror]:shr-overflow-y-auto [&_.ProseMirror]:shr-px-0.75 [&_.ProseMirror]:shr-py-0.5 [&_.ProseMirror]:shr-text-base [&_.ProseMirror]:shr-leading-normal [&_.ProseMirror]:shr-text-black [&_.ProseMirror]:shr-outline-none',
      // placeholder
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-text-grey [&_.ProseMirror_p.is-editor-empty:first-child::before]:shr-content-[attr(data-placeholder)]',
      // content styles (shared with RichTextContent)
      ...editorContentClasses,
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
        className,
        editorClassName,
        onImageUpload,
        acceptedMimeTypes,
      }: RichTextEditorProps,
      ref,
    ) => {
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

      const editor = useRichTextEditor({
        value,
        defaultValue: normalizedDefaultValue,
        onChange: handleChange,
        onImageUpload,
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
          getHTML: () => editor?.getHTML() ?? '',
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

      const classNames = classNameGenerator({ disabled, readOnly, error })

      // editorが未初期化でもwrapperは常に描画する
      // FormControlがdata-smarthr-ui-inputを初回mountで発見できるようにするため
      const toolbar = editor && !readOnly && !hideToolbar && (
        <RichTextEditorProvider
          editor={editor}
          features={features}
          headingLevels={headingLevels}
          onImageUpload={onImageUpload}
          acceptedMimeTypes={acceptedMimeTypes}
        >
          <div ref={toolbarRef} className={classNames.toolbarWrapper()}>
            <RichTextEditorToolbar />
          </div>
        </RichTextEditorProvider>
      )

      return (
        <div className={classNames.wrapper({ className })}>
          {toolbar}
          <div
            ref={contentRef}
            data-smarthr-ui-input="true"
            className={classNames.content({ className: editorClassName })}
          >
            {editor && <EditorContent editor={editor} />}
          </div>
        </div>
      )
    },
  ),
)
