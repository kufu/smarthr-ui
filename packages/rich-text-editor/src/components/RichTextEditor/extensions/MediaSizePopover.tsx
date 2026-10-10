'use client'

import { type FC, type KeyboardEvent, memo, useId, useMemo, useRef, useState } from 'react'
import { FaLockIcon, FaUpRightAndDownLeftFromCenterIcon, FormControl, Input } from 'smarthr-ui'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { tv } from '../../../libs/tv'

import { ImagePopoverForm } from './Image/ImagePopoverForm'
import { calcHeightFromWidth, calcWidthFromHeight } from './Image/aspectRatio'
import { resolveImageElement } from './Image/resolveImageElement'
import {
  YOUTUBE_ASPECT_RATIO,
  YOUTUBE_DEFAULT_SIZE,
  YOUTUBE_MIN_SIZE,
  calcYoutubeHeight,
} from './youtubeOptions'

import type { Editor } from '@tiptap/react'

const classNameGenerator = tv({
  slots: {
    row: 'shr-rte-flex shr-rte-gap-0.5 [align-items:last_baseline]',
    lock: 'shr-rte-shrink-0 shr-rte-text-grey',
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

type MediaSize = { width: number | null; height: number | null }

type MediaSizeSpec = {
  nodeName: 'image' | 'youtube'
  resolveElement: (dom: Node | null) => HTMLElement | null
  getRatio: (element: HTMLElement | null) => { w: number; h: number }
  /** 保存された高さより比率を優先する。比率を変えられない媒体で、比率の違う古い値を見せないため */
  fixedRatio: boolean
  normalize: (width: number, height: number) => MediaSize | null
  resetAttributes: MediaSize
}

const isPositive = (n: number) => Number.isFinite(n) && n > 0

export const IMAGE_SIZE_SPEC: MediaSizeSpec = {
  nodeName: 'image',
  resolveElement: resolveImageElement,
  getRatio: (element) =>
    element instanceof HTMLImageElement
      ? { w: element.naturalWidth, h: element.naturalHeight }
      : { w: 0, h: 0 },
  fixedRatio: false,
  normalize: (width, height) => ({
    width: isPositive(width) ? width : null,
    height: isPositive(height) ? height : null,
  }),
  resetAttributes: { width: null, height: null },
}

export const YOUTUBE_SIZE_SPEC: MediaSizeSpec = {
  nodeName: 'youtube',
  resolveElement: (dom) =>
    dom instanceof HTMLElement
      ? (dom.querySelector<HTMLElement>('div[data-youtube-video]') ?? dom)
      : null,
  getRatio: () => ({ w: YOUTUBE_ASPECT_RATIO.width, h: YOUTUBE_ASPECT_RATIO.height }),
  fixedRatio: true,
  // 高さは入力値ではなく幅から求め直す。丸めの差で 16:9 から外れた値を保存しないため
  normalize: (width) => {
    if (!isPositive(width)) return null

    const w = Math.max(Math.round(width), YOUTUBE_MIN_SIZE.width)

    return { width: w, height: calcYoutubeHeight(w) }
  },
  resetAttributes: { ...YOUTUBE_DEFAULT_SIZE },
}

type Props = {
  editor: Editor
  pos: number
  spec: MediaSizeSpec
  tabIndex?: number
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

export const MediaSizePopover: FC<Props> = memo(({ editor, pos, spec, ...rest }) => {
  const { localize } = useIntl()
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const ratioRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
  const widthInputRef = useRef<HTMLInputElement>(null)
  const descriptionId = useId()

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

  const latest = useLatest({ width, height, spec })

  const functions = useMemo(
    () => ({
      handleOpen: (targetPos: number) => {
        const node = editor.state.doc.nodeAt(targetPos)
        const element = latest.spec.resolveElement(editor.view.nodeDOM(targetPos))

        ratioRef.current = latest.spec.getRatio(element)
        // width/height 属性が未設定なら、現在の表示サイズを初期値として入れる
        const renderedW = element?.offsetWidth ?? 0
        const renderedH = element?.offsetHeight ?? 0
        const initialWidth = node?.attrs.width
          ? String(node.attrs.width)
          : renderedW
            ? String(renderedW)
            : ''
        const fixedHeight = latest.spec.fixedRatio
          ? calcHeightFromWidth(Number(initialWidth), ratioRef.current.w, ratioRef.current.h)
          : undefined

        setWidth(initialWidth)
        setHeight(
          fixedHeight !== undefined
            ? String(fixedHeight)
            : node?.attrs.height
              ? String(node.attrs.height)
              : renderedH
                ? String(renderedH)
                : '',
        )
      },
      handleWidthChange: (value: string) => {
        setWidth(value)

        const h = calcHeightFromWidth(Number(value), ratioRef.current.w, ratioRef.current.h)

        if (h !== undefined) setHeight(String(h))
      },
      handleHeightChange: (value: string) => {
        setHeight(value)

        const w = calcWidthFromHeight(Number(value), ratioRef.current.w, ratioRef.current.h)

        if (w !== undefined) setWidth(String(w))
      },
      handleSubmit: (targetPos: number) => {
        const attributes = latest.spec.normalize(Number(latest.width), Number(latest.height))

        if (attributes) {
          editor
            .chain()
            .setNodeSelection(targetPos)
            .updateAttributes(latest.spec.nodeName, attributes)
            .run()
        }
      },
      handleReset: (targetPos: number) => {
        editor
          .chain()
          .setNodeSelection(targetPos)
          .updateAttributes(latest.spec.nodeName, latest.spec.resetAttributes)
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
            aria-describedby={descriptionId}
            onChange={(e) => functions.handleWidthChange(e.target.value)}
          />
        </FormControl>
        <FaLockIcon className={CLASS_NAMES.lock} />
        <FormControl label={heightLabel}>
          <Input
            type="number"
            name="imageHeight"
            value={height}
            width="6em"
            aria-describedby={descriptionId}
            onChange={(e) => functions.handleHeightChange(e.target.value)}
          />
        </FormControl>
      </div>
      {/* 見えない文字として置くと、ポップオーバーの中で単独の読み上げ対象になり「クリック可能」と読まれる */}
      <span id={descriptionId} hidden>
        {lockLabel}
      </span>
    </ImagePopoverForm>
  )
})
