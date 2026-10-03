'use client'

import { type FC, type KeyboardEvent, memo } from 'react'
import { FaAngleDownIcon, FaAngleUpIcon } from 'smarthr-ui'

import { useIntl } from '../../../intl'

import { ToolbarTooltip } from './ToolbarTooltip'
import { TOOLBAR_ITEM_CLASS_NAME } from './toolbarItemStyle'

type Props = {
  wrapped: boolean
  handleClick: () => void
  tabIndex?: number
  disabled?: boolean
  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: () => void
  ref?: (el: HTMLButtonElement | null) => void
}

/**
 * ToolbarButton を使わないのは、押下状態に primary の塗りが付き、書式を適用する
 * ボタンと同じ見た目になるため。状態はアイコンの向きで示す。
 *
 * aria-expanded ではなく aria-pressed なのは、項目がどちらの表示でも DOM にあり、
 * 横スクロールすれば到達できるため。
 */
export const ToolbarWrapToggle: FC<Props> = memo(
  ({ wrapped, handleClick, tabIndex = -1, disabled, onKeyDown, onFocus, ref }) => {
    const { localize } = useIntl()
    const label = localize({
      id: 'smarthr-ui/RichTextEditor/wrapToolbar',
      defaultText: '折り返して表示',
    })

    return (
      // 右端にあるため、中央揃えではツールチップがウィンドウ外へ出る
      <ToolbarTooltip align="end" suppressed={disabled} label={label}>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          tabIndex={tabIndex}
          className={`${TOOLBAR_ITEM_CLASS_NAME} smarthr-ui-RichTextEditor-ToolbarWrapToggle`}
          aria-label={label}
          aria-pressed={wrapped}
          onClick={handleClick}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        >
          {wrapped ? <FaAngleUpIcon /> : <FaAngleDownIcon />}
        </button>
      </ToolbarTooltip>
    )
  },
)
