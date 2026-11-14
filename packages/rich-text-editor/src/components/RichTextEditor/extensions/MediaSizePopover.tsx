'use client'

import { type FC, memo, useId, useMemo, useRef, useState } from 'react'
import { FaLockIcon, FaUpRightAndDownLeftFromCenterIcon, FormControl, Input } from 'smarthr-ui'

import { useLatest } from '../../../hooks/useLatest'
import { useIntl } from '../../../intl'
import { tv } from '../../../libs/tv'

import { resolveImageElement } from './Image/resolveImageElement'
import { MediaPopoverForm } from './MediaPopoverForm'
import { VIDEO_MIN_SIZE } from './Video/CustomVideo'
import { calcHeightFromWidth, calcWidthFromHeight, isPositiveNumber } from './aspectRatio'
import {
  YOUTUBE_ASPECT_RATIO,
  YOUTUBE_DEFAULT_SIZE,
  YOUTUBE_MIN_SIZE,
  calcYoutubeHeight,
} from './youtubeOptions'

import type { MediaNodeName } from './mediaNode'
import type { RovingButtonProps } from '../hooks/useRovingToolbar'
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

type Ratio = { w: number; h: number }

type MediaSizeSpec = {
  nodeName: MediaNodeName
  resolveElement: (dom: Node | null) => HTMLElement | null
  getRatio: (element: HTMLElement | null) => Ratio
  /** 保存された高さより比率を優先する。比率を変えられない媒体で、比率の違う古い値を見せないため */
  fixedRatio: boolean
  normalize: (width: number, height: number, ratio: Ratio) => MediaSize | null
  resetAttributes: MediaSize
}

const toPositiveSize = (width: number, height: number): MediaSize => ({
  width: isPositiveNumber(width) ? width : null,
  height: isPositiveNumber(height) ? height : null,
})

export const IMAGE_SIZE_SPEC: MediaSizeSpec = {
  nodeName: 'image',
  resolveElement: resolveImageElement,
  getRatio: (element) =>
    element instanceof HTMLImageElement
      ? { w: element.naturalWidth, h: element.naturalHeight }
      : { w: 0, h: 0 },
  fixedRatio: false,
  normalize: toPositiveSize,
  resetAttributes: { width: null, height: null },
}

export const VIDEO_SIZE_SPEC: MediaSizeSpec = {
  nodeName: 'video',
  resolveElement: (dom) =>
    dom instanceof HTMLElement ? dom.querySelector<HTMLElement>('video') : null,
  // NodeView は保存された寸法があればその比率で表示するため、動画本来の比率より先に見る
  getRatio: (element) => {
    if (!(element instanceof HTMLVideoElement)) return { w: 0, h: 0 }

    return element.width > 0 && element.height > 0
      ? { w: element.width, h: element.height }
      : { w: element.videoWidth, h: element.videoHeight }
  },
  // 動画は枠の比率を変えても中身が伸びず、余白が付くだけになる
  fixedRatio: true,
  normalize: (width, _height, ratio) => {
    const roundedWidth = Math.round(width)

    if (!isPositiveNumber(roundedWidth)) return { width: null, height: null }

    // 入力欄の高さを使わないのは、比率が分からないうちは読み込み前の video の既定の
    // 300×150 の枠の高さが入っているため
    if (!isPositiveNumber(ratio.w) || !isPositiveNumber(ratio.h)) {
      return { width: Math.max(roundedWidth, VIDEO_MIN_SIZE.width), height: null }
    }

    // YouTube のように幅だけを最小に揃えないのは、横長の動画では高さが最小を割り、
    // ドラッグでのリサイズでは作れない大きさになるため
    const minWidth = Math.ceil(
      Math.max(VIDEO_MIN_SIZE.width, (VIDEO_MIN_SIZE.height * ratio.w) / ratio.h),
    )
    const w = Math.max(roundedWidth, minWidth)

    return { width: w, height: calcHeightFromWidth(w, ratio.w, ratio.h) ?? null }
  },
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
    if (!isPositiveNumber(width)) return null

    const w = Math.max(Math.round(width), YOUTUBE_MIN_SIZE.width)

    return { width: w, height: calcYoutubeHeight(w) }
  },
  resetAttributes: { ...YOUTUBE_DEFAULT_SIZE },
}

type Props = RovingButtonProps & {
  editor: Editor
  pos: number
  spec: MediaSizeSpec
}

export const MediaSizePopover: FC<Props> = memo(({ editor, pos, spec, ...rest }) => {
  const { localize } = useIntl()
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const ratioRef = useRef<Ratio>({ w: 0, h: 0 })
  const widthInputRef = useRef<HTMLInputElement>(null)
  const descriptionId = useId()

  const label = localize({ id: 'smarthr-ui/RichTextEditor/imageWidth', defaultText: 'サイズ' })
  const widthLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageWidthLabel',
    defaultText: '幅（px）',
  })
  const heightLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageHeightLabel',
    defaultText: '高さ（px）',
  })
  const resetLabel = localize({
    id: 'smarthr-ui/RichTextEditor/imageSizeReset',
    defaultText: '元のサイズに戻す',
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
        const attributes = latest.spec.normalize(
          Number(latest.width),
          Number(latest.height),
          ratioRef.current,
        )

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
    <MediaPopoverForm
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
    </MediaPopoverForm>
  )
})
