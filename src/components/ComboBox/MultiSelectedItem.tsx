import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { UnstyledButton } from '../Button'
import { Chip } from '../Chip'
import { FaTimesCircleIcon } from '../Icon'

import { MultiSelectedItemTooltip } from './MultiSelectedItemTooltip'
import { ComboBoxItem } from './types'
import { useMultiComboBoxClassNames } from './useClassNames'

export type Props<T> = {
  item: ComboBoxItem<T> & { deletable?: boolean }
  disabled: boolean
  onDelete: (item: ComboBoxItem<T>) => void
  enableEllipsis?: boolean
  buttonRef: RefObject<HTMLButtonElement>
  decorators?: {
    destroyButtonIconAlt?: (text: string) => string
  }
}

const DESTROY_BUTTON_TEXT = '削除'

export function MultiSelectedItem<T>({
  item,
  disabled,
  onDelete,
  enableEllipsis,
  buttonRef,
  decorators,
}: Props<T>) {
  const theme = useTheme()
  const labelRef = useRef<HTMLDivElement>(null)
  const [needsTooltip, setNeedsTooltip] = useState(false)
  const { deletable = true } = item

  const actualOnDelete = useCallback(() => {
    onDelete && onDelete(item)
  }, [item, onDelete])

  useEffect(() => {
    const elem = labelRef.current
    if (!elem || !enableEllipsis) {
      return
    }
    if (elem.offsetWidth < elem.scrollWidth) {
      setNeedsTooltip(true)
    }
  }, [enableEllipsis])

  const classNames = useMultiComboBoxClassNames()

  return (
    <MultiSelectedItemTooltip needsTooltip={needsTooltip} text={item.label}>
      <Chip
        disabled={disabled}
        className={`${classNames.selectedItem} shr-flex shr-items-center shr-gap-0.75 shr-leading-normal [&]:shr-rounded-em`}
      >
        <ItemLabel
          enableEllipsis={enableEllipsis}
          className={classNames.selectedItemLabel}
          ref={labelRef}
        >
          {item.label}
        </ItemLabel>

        {deletable && (
          <DeleteButton
            type="button"
            themes={theme}
            className={classNames.deleteButton}
            disabled={disabled}
            onClick={actualOnDelete}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()

                // HINT: イベントの伝播が止まる関係でonClickに設定したonDeleteは実行されない
                // このタイミングで明示的に削除処理を実行する
                actualOnDelete()
              }
            }}
            ref={buttonRef}
            tabIndex={-1}
          >
            <FaTimesCircleIcon
              color={disabled ? 'TEXT_DISABLED' : 'inherit'}
              alt={decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT}
            />
          </DeleteButton>
        )}
      </Chip>
    </MultiSelectedItemTooltip>
  )
}

const ItemLabel = styled.span<{ enableEllipsis?: boolean }>`
  ${({ enableEllipsis }) => css`
    ${enableEllipsis &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  `}
`
const DeleteButton = styled(UnstyledButton)<{ themes: Theme; disabled?: boolean }>`
  ${({ themes: { color, radius, shadow }, disabled }) => css`
    flex-shrink: 1;

    border-radius: ${radius.full};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    line-height: 0;
    color: ${color.TEXT_BLACK};

    &:focus-visible {
      box-shadow: unset;
    }

    &:focus-visible > svg {
      border-radius: ${radius.full};
      ${shadow.focusIndicatorStyles};
    }
  `}
`
