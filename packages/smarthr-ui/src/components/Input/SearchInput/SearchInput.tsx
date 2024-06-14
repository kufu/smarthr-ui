import React, { ComponentProps, forwardRef, useId, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../../Button'
import { FaCircleXmarkIcon, FaMagnifyingGlassIcon } from '../../Icon'
import { VisuallyHiddenText } from '../../VisuallyHiddenText'
import { InputWithTooltip } from '../InputWithTooltip'

import type { DecoratorsType } from '../../../types'

type Props = Omit<ComponentProps<typeof InputWithTooltip>, 'tooltipMessage' | 'prefix'> & {
  /** 入力欄の説明を紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
  decorators?: DecoratorsType<'iconAlt' | 'clearButtonAlt'>
  onClickClear?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ICON_ALT = '検索'
const CLEAR_BUTTON_ALT = '削除'

const searchInput = tv({
  slots: {
    clearButton: [
      'smarthr-ui-SearchInput-clearButton',
      'shr-group/clearButton',
      'shr-cursor-pointer',
      'focus-visible:shr-shadow-none',
    ],
    clearButtonIcon: [
      'shr-block',
      'group-focus-visible/clearButton:shr-focus-indicator group-focus-visible/clearButton:shr-rounded-full',
    ],
  },
})

export const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ decorators, onClickClear, ...props }, ref) => {
    const { clearButton, clearButtonIcon } = searchInput()
    const { clearButtonStyle, clearButtonIconStyle } = useMemo(
      () => ({
        clearButtonStyle: clearButton(),
        clearButtonIconStyle: clearButtonIcon(),
      }),
      [clearButton, clearButtonIcon],
    )

    const iconAlt = useMemo(() => decorators?.iconAlt?.(ICON_ALT) || ICON_ALT, [decorators])
    const clearButtonAlt = useMemo(
      () => decorators?.clearButtonAlt?.(CLEAR_BUTTON_ALT) || CLEAR_BUTTON_ALT,
      [decorators],
    )

    const defaultInptuId = useId()
    const inputId = props.id || defaultInptuId

    return (
      <span>
        <label htmlFor={inputId}>
          <VisuallyHiddenText>{iconAlt}</VisuallyHiddenText>
        </label>
        <InputWithTooltip
          {...props}
          id={inputId}
          ref={ref}
          prefix={<FaMagnifyingGlassIcon color="TEXT_GREY" />}
          suffix={
            onClickClear &&
            props.value && (
              <UnstyledButton onClick={(e) => onClickClear(e)} className={clearButtonStyle}>
                <FaCircleXmarkIcon
                  color="TEXT_BLACK"
                  alt={clearButtonAlt}
                  className={clearButtonIconStyle}
                />
              </UnstyledButton>
            )
          }
        />
      </span>
    )
  },
)
