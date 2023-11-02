import React, { RefObject, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { UnstyledButton } from '../Button'
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
      <Wrapper themes={theme} disabled={disabled} className={classNames.selectedItem}>
        <ItemLabel
          themes={theme}
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
            onClick={() => {
              onDelete && onDelete(item)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
            ref={buttonRef}
            tabIndex={-1}
          >
            <FaTimesCircleIcon
              color="inherit"
              alt={decorators?.destroyButtonIconAlt?.(DESTROY_BUTTON_TEXT) || DESTROY_BUTTON_TEXT}
            />
          </DeleteButton>
        )}
      </Wrapper>
    </MultiSelectedItemTooltip>
  )
}

const Wrapper = styled.div<{ themes: Theme; disabled?: boolean }>`
  ${({ themes, disabled }) => {
    const { border, color, fontSize } = themes

    return css`
      position: relative;
      display: flex;
      border-radius: 1em;
      border: ${border.shorthand};
      background-color: ${disabled ? color.disableColor(color.WHITE) : color.WHITE};
      color: ${disabled ? color.TEXT_DISABLED : color.TEXT_BLACK};
      font-size: ${fontSize.S};
    `
  }}
`
const ItemLabel = styled.div<{ enableEllipsis?: boolean; themes: Theme }>`
  ${({ enableEllipsis, themes: { border, spacingByChar } }) => css`
    padding: ${spacingByChar(0.25)} calc(${spacingByChar(0.5)} - ${border.lineWidth});

    ${enableEllipsis &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  `}
`
const DeleteButton = styled(UnstyledButton)<{ themes: Theme; disabled?: boolean }>`
  ${({ themes: { border, spacingByChar, shadow }, disabled }) => css`
    flex-shrink: 1;
    padding: calc(${spacingByChar(0.5)} - ${border.lineWidth});
    border-radius: 50%;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    line-height: 0;

    &:focus-visible {
      box-shadow: unset;
    }

    &:focus-visible > svg {
      border-radius: 50%;
      ${shadow.focusIndicatorStyles};
    }
  `}
`
