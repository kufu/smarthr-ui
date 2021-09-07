import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

import { FaTimesCircleIcon } from '../Icon'
import { UnstyledButton } from '../Button'
import { Item } from './types'

export type Props<T> = {
  item: Item<T> & { deletable?: boolean }
  disabled: boolean
  onDelete: (item: Item<T>) => void
  enableEllipsis?: boolean
  onEllipsis?: () => void
}

export function MultiSelectedItemInner<T>({
  item,
  disabled,
  onDelete,
  enableEllipsis,
  onEllipsis,
}: Props<T>) {
  const theme = useTheme()
  const labelRef = useRef<HTMLDivElement>(null)
  const { deletable = true } = item

  useEffect(() => {
    const elem = labelRef.current
    if (!elem || !enableEllipsis || !onEllipsis) {
      return
    }
    if (elem.offsetWidth < elem.scrollWidth) {
      onEllipsis()
    }
  }, [enableEllipsis, onEllipsis])

  const classNames = useClassNames().multi

  return (
    <SelectedItem themes={theme} disabled={disabled} className={classNames.selectedItem}>
      <SelectedItemLabel
        themes={theme}
        enableEllipsis={enableEllipsis}
        className={classNames.selectedItemLabel}
        ref={labelRef}
      >
        {item.label}
      </SelectedItemLabel>

      {deletable && (
        <DeleteButton
          type="button"
          themes={theme}
          className={classNames.deleteButton}
          disabled={disabled}
          onClick={() => {
            // IE対応: 外側クリック判定が完了するまで要素が除去されないようにディレイを入れる
            setTimeout(() => {
              onDelete && onDelete(item)
            }, 0)
          }}
        >
          <FaTimesCircleIcon
            size={11}
            color={'inherit'}
            visuallyHiddenText={`${item.label}を削除`}
          />
        </DeleteButton>
      )}
    </SelectedItem>
  )
}

const borderWidth = 1
const SelectedItem = styled.div<{ themes: Theme; disabled?: boolean }>`
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
const SelectedItemLabel = styled.div<{ enableEllipsis?: boolean; themes: Theme }>`
  ${({ enableEllipsis, themes: { spacingByChar } }) => {
    return css`
      flex: 1;
      padding: calc(${spacingByChar(0.5)} - ${borderWidth}px);

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
  ${({ themes: { spacingByChar, shadow }, disabled }) => {
    return css`
      flex: 0;
      padding: calc(${spacingByChar(0.5)} - ${borderWidth}px);
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
