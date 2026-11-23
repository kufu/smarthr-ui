'use client'

import { type FC, memo, useMemo, useRef, useState } from 'react'
import { FaPenToSquareIcon, FormControl, Input } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { MediaPopoverForm } from '../MediaPopoverForm'

import type { RovingButtonProps } from '../../hooks/useRovingToolbar'
import type { Editor } from '@tiptap/react'

const ICON = <FaPenToSquareIcon alt="" />

type Props = RovingButtonProps & {
  editor: Editor
  pos: number
}

export const ImageAltPopover: FC<Props> = memo(({ editor, ...rest }) => {
  const { localize } = useIntl()
  const [alt, setAlt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const label = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltLabel',
    defaultText: '代替テキスト',
  })
  const helpText = localize({
    id: 'smarthr-ui/RichTextEditor/imageAltHelp',
    defaultText: '画像の内容を説明してください。',
  })

  const latest = useLatest({ editor, alt })

  const functions = useMemo(
    () => ({
      handleOpen: (targetPos: number) => {
        const node = latest.editor.state.doc.nodeAt(targetPos)

        setAlt(typeof node?.attrs.alt === 'string' ? node.attrs.alt : '')
      },
      handleSubmit: (targetPos: number) => {
        latest.editor
          .chain()
          .setNodeSelection(targetPos)
          .updateAttributes('image', { alt: latest.alt })
          .run()
      },
    }),
    [latest],
  )

  return (
    <MediaPopoverForm
      {...rest}
      initialFocusRef={inputRef}
      editor={editor}
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
    </MediaPopoverForm>
  )
})
