import React, { RefObject, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { FaTimesCircleIcon } from '../Icon'
import { UnstyledButton } from '../Button'
import { ComboBoxItem } from './types'
import { MultiSelectedItemTooltip } from './MultiSelectedItemTooltip'

export type Props<T> = {
  item: ComboBoxItem<T> & { deletable?: boolean }
  disabled: boolean
  onDelete: (item: ComboBoxItem<T>) => void
  enableEllipsis?: boolean
  buttonRef: RefObject<HTMLButtonElement>
}

export function MultiSelectedItem<T>({
  item,
  disabled,
  onDelete,
  enableEllipsis,
  buttonRef,
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

  const classNames = useClassNames().multi

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
              size={11}
              color={'inherit'}
              visuallyHiddenText={`${item.label}を削除`}
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
      border-radius: 1rem;
      border: ${border.shorthand};
      background-color: ${disabled ? color.disableColor(color.WHITE) : color.WHITE};
      color: ${disabled ? color.TEXT_DISABLED : color.TEXT_BLACK};
      font-size: ${fontSize.S};
      line-height: 1;
    `
  }}
`
const ItemLabel = styled.div<{ enableEllipsis?: boolean; themes: Theme }>`
  ${({ enableEllipsis, themes: { border, spacingByChar } }) => {
    return css`
      flex: 1 1 0;
      padding: calc(${spacingByChar(0.5)} - ${border.lineWidth});

      ${enableEllipsis &&
      css`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
    `
  }}
`
const DeleteButton = styled(UnstyledButton)<{ themes: Theme; disabled?: boolean }>`
  ${({ themes: { border, spacingByChar, shadow }, disabled }) => {
    return css`
      flex: 0 1 0;
      padding: calc(${spacingByChar(0.5)} - ${border.lineWidth});
      border-radius: 50%;
      cursor: ${disabled ? 'not-allowed' : 'pointer'};
      line-height: 0;

      &:focus {
        outline: 0;
      }

      &:focus > svg {
        border-radius: 50%;
        box-shadow: ${shadow.OUTLINE};
      }
    `
  }}
`
