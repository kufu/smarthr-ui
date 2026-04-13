'use client'

import { EditorContent } from '@tiptap/react'
import { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { RichTextEditorToolbar } from '../Toolbar/RichTextEditorToolbar'
import { RichTextEditorProvider } from '../context/RichTextEditorContext'
import { useRichTextEditor } from '../hooks/useRichTextEditor'
import { editorContentClasses } from '../styles'

import type { RichTextEditorController, RichTextEditorProps, RichTextJSON } from '../types'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-RichTextEditor',
      'shr-border-shorthand shr-rounded-m',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
    ],
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
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        features = ['bold', 'italic', 'bulletList', 'orderedList', 'link'] as const,
        hideToolbar,
        disabled,
        readOnly,
        error,
        placeholder,
        className,
        editorClassName,
      },
      ref,
    ) => {
      const toolbarRef = useRef<HTMLDivElement>(null)
      const contentRef = useRef<HTMLDivElement>(null)

      const editor = useRichTextEditor({
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        features,
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
            wrapperEl.removeAttribute('aria-describedby')
          }

          if (ariaInvalid) {
            proseMirrorEl.setAttribute('aria-invalid', ariaInvalid)
            wrapperEl.removeAttribute('aria-invalid')
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

      const classNames = classNameGenerator({ disabled, readOnly, error })

      // editorが未初期化でもwrapperは常に描画する
      // FormControlがdata-smarthr-ui-inputを初回mountで発見できるようにするため
      const toolbar = editor && !readOnly && !hideToolbar && (
        <RichTextEditorProvider editor={editor} features={features}>
          <div ref={toolbarRef}>
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
