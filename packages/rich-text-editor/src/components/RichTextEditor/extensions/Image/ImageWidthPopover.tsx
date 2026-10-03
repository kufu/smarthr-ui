'use client'

import { type FC, type KeyboardEvent, memo, useMemo, useRef, useState } from 'react'
import { FaLockIcon, FaUpRightAndDownLeftFromCenterIcon, FormControl, Input } from 'smarthr-ui'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'
import { tv } from '../../../../libs/tv'

import { ImagePopoverForm } from './ImagePopoverForm'
import { calcHeightFromWidth, calcWidthFromHeight } from './aspectRatio'
import { resolveImageElement } from './resolveImageElement'

import type { Editor } from '@tiptap/react'

const classNameGenerator = tv({
  slots: {
    row: 'shr-flex shr-gap-0.5 [align-items:last_baseline]',
    lock: 'shr-shrink-0 shr-text-grey',
  },
})

const CLASS_NAMES = (() => {
  const { lock, row } = classNameGenerator()

  return {
    lock: lock(),
    row: row(),
  }
})()

const ICON = <FaUpRightAndDownLeftFromCenterIcon alt="" />

type Props = {
  editor: Editor
  pos: number
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

const getNaturalSize = (editor: Editor, pos: number): { w: number; h: number } => {
  const img = resolveImageElement(editor.view.nodeDOM(pos))

  return { w: img?.naturalWidth ?? 0, h: img?.naturalHeight ?? 0 }
}

// 画面に表示されている実寸（max-width:100% による縮小後のサイズ）
const getRenderedSize = (editor: Editor, pos: number): { w: number; h: number } => {
  const img = resolveImageElement(editor.view.nodeDOM(pos))

  return { w: img?.offsetWidth ?? 0, h: img?.offsetHeight ?? 0 }
}

export const ImageWidthPopover: FC<Props> = memo(({ editor, pos, ...rest }) => {
  const { localize } = useIntl()
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const naturalRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const widthInputRef = useRef<HTMLInputElement>(null)

  const label = localize({ id: 'smarthr-ui/RichTextEditor/imageWidth', defaultText: 'サイズ' })
  const widthLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageWidthLabel',
    defaultText: '幅 (px)',
  })
  const heightLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageHeightLabel',
    defaultText: '高さ (px)',
  })
  const resetLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageSizeReset',
    defaultText: 'リセット',
  })
  const lockLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageAspectLocked',
    defaultText: '縦横比を固定',
  })

  const latest = useLatest({ width, height })

  const functions = useMemo(
    () => ({
      handleOpen: (targetPos: number) => {
        const node = editor.state.doc.nodeAt(targetPos)

        naturalRef.current = getNaturalSize(editor, targetPos)
        // width/height 属性が未設定なら、現在の表示サイズを初期値として入れる
        const rendered = getRenderedSize(editor, targetPos)
        setWidth(
          node?.attrs.width ? String(node.attrs.width) : rendered.w ? String(rendered.w) : '',
        )
        setHeight(
          node?.attrs.height ? String(node.attrs.height) : rendered.h ? String(rendered.h) : '',
        )
      },
      handleWidthChange: (value: string) => {
        setWidth(value)

        const h = calcHeightFromWidth(Number(value), naturalRef.current.w, naturalRef.current.h)

        if (h !== undefined) setHeight(String(h))
      },
      handleHeightChange: (value: string) => {
        setHeight(value)

        const w = calcWidthFromHeight(Number(value), naturalRef.current.w, naturalRef.current.h)

        if (w !== undefined) setWidth(String(w))
      },
      handleSubmit: (targetPos: number) => {
        const w = Number(latest.width)
        const h = Number(latest.height)

        editor
          .chain()
          .setNodeSelection(targetPos)
          .updateAttributes('image', {
            width: Number.isFinite(w) && w > 0 ? w : null,
            height: Number.isFinite(h) && h > 0 ? h : null,
          })
          .run()
      },
      handleReset: (targetPos: number) => {
        editor
          .chain()
          .setNodeSelection(targetPos)
          .updateAttributes('image', { width: null, height: null })
          .run()
      },
    }),
    [editor, latest],
  )

  const secondaryAction = useMemo(
    () => ({ label: resetLabel, handleClick: functions.handleReset }),
    [resetLabel, functions],
  )

  return (
    <ImagePopoverForm
      {...rest}
      initialFocusRef={widthInputRef}
      editor={editor}
      pos={pos}
      secondaryAction={secondaryAction}
      handleOpen={functions.handleOpen}
      handleSubmit={functions.handleSubmit}
      icon={ICON}
      label={label}
    >
      <div className={CLASS_NAMES.row}>
        <FormControl label={widthLabel}>
          <Input
            ref={widthInputRef}
            type="number"
            name="imageWidth"
            value={width}
            width="6em"
            onChange={(e) => functions.handleWidthChange(e.target.value)}
          />
        </FormControl>
        <FaLockIcon alt={lockLabel} className={CLASS_NAMES.lock} />
        <FormControl label={heightLabel}>
          <Input
            type="number"
            name="imageHeight"
            value={height}
            width="6em"
            onChange={(e) => functions.handleHeightChange(e.target.value)}
          />
        </FormControl>
      </div>
    </ImagePopoverForm>
  )
})
