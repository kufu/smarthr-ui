'use client'

import { type FC, type KeyboardEvent, memo } from 'react'

import { useIntl } from '../../../intl'
import { FaAngleDownIcon, FaAngleUpIcon } from '../../Icon'

import { TOOLBAR_ITEM_CLASS_NAME } from './toolbarItemStyle'

type Props = {
  /** true のとき2段目が開いている */
  expanded: boolean
  /** 2段目の要素の id。aria-controls に渡す */
  controls: string
  /** 押されたときに呼ばれる。開閉の状態は呼び出し側が持つ */
  handleClick: () => void
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

/**
 * モバイル時にツールバーの2段目を開閉するトグル。
 *
 * ToolbarButton を使わないのは、ToolbarButton が常に aria-pressed を付けるため。
 * 開閉は aria-expanded で表すべき状態で、aria-pressed と併用すると二重表現になる。
 * ToolbarTooltip も使わない。このトグルはモバイル時にしか描画されず、
 * モバイルではツールチップ自体を抑制しているため常に何も出ない。
 */
export const MoreFormatsToggle: FC<Props> = memo(
  ({ expanded, controls, handleClick, tabIndex = -1, disabled, onKeyDown, onFocus, ref }) => {
    const { localize } = useIntl()
    const label = localize({
      id: 'smarthr-ui/RichTextEditor/moreFormats',
      defaultText: 'その他の書式',
    })

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={tabIndex}
        disabled={disabled}
        aria-label={label}
        aria-expanded={expanded}
        aria-controls={controls}
        className={`${TOOLBAR_ITEM_CLASS_NAME} smarthr-ui-RichTextEditor-MoreFormatsToggle`}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      >
        {expanded ? <FaAngleUpIcon /> : <FaAngleDownIcon />}
      </button>
    )
  },
)
