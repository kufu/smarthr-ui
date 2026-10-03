'use client'

import { type FC, type KeyboardEvent, memo, useMemo, useRef, useState } from 'react'
import { FaPenToSquareIcon, FormControl, Input } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'

import { ImagePopoverForm } from './ImagePopoverForm'

import type { Editor } from '@tiptap/react'

const ICON = <FaPenToSquareIcon alt="" />

type Props = {
  editor: Editor
  pos: number
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const ImageAltPopover: FC<Props> = memo(({ editor, pos, ...rest }) => {
  const { localize } = useIntl()
  const [alt, setAlt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const label = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltLabel',
    defaultText: '代替テキスト（alt）',
  })
  const helpText = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltHelp',
    defaultText: '画像の内容を説明してください',
  })

  const latest = useLatest({ alt })

  const functions = useMemo(
    () => ({
      handleOpen: (targetPos: number) => {
        const node = editor.state.doc.nodeAt(targetPos)

        setAlt(typeof node?.attrs.alt === 'string' ? node.attrs.alt : '')
      },
      handleSubmit: (targetPos: number) => {
        editor
          .chain()
          .setNodeSelection(targetPos)
          .updateAttributes('image', { alt: latest.alt })
          .run()
      },
    }),
    [editor, latest],
  )

  return (
    <ImagePopoverForm
      {...rest}
      initialFocusRef={inputRef}
      editor={editor}
      pos={pos}
      handleOpen={functions.handleOpen}
      handleSubmit={functions.handleSubmit}
      icon={ICON}
      label={label}
    >
      <FormControl label={label} helpMessage={helpText}>
        <Input
          ref={inputRef}
          name="imageAlt"
          value={alt}
          width="20em"
          onChange={(e) => setAlt(e.target.value)}
        />
      </FormControl>
    </ImagePopoverForm>
  )
})
