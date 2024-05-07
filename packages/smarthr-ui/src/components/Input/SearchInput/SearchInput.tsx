import React, { ComponentProps, forwardRef, useCallback, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../../Button'
import { FaCircleXmarkIcon, FaMagnifyingGlassIcon } from '../../Icon'
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
      'shr-me-0.5 shr-cursor-pointer',
      'focus-visible:shr-shadow-none',
    ],
    clearButtonIcon: [
      'shr-block',
      'group-focus-visible/clearButton:shr-focus-indicator group-focus-visible/clearButton:shr-rounded-full',
    ],
  },
})

export const SearchInput = forwardRef<HTMLInputElement, Props>(({ decorators, ...props }, ref) => {
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
    () => decorators?.iconAlt?.(CLEAR_BUTTON_ALT) || CLEAR_BUTTON_ALT,
    [decorators],
  )

  const onClickClear = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.onClickClear?.(e),
    [props],
  )

  return (
    <label>
      <InputWithTooltip
        {...props}
        ref={ref}
        prefix={<FaMagnifyingGlassIcon alt={iconAlt} color="TEXT_GREY" />}
        suffix={
          props.onClickClear && (
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
    </label>
  )
})
