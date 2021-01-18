import React, { FC, useCallback, useContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { getIsInclude, mapToKeyArray } from '../../libs/map'
import { isTouchDevice } from '../../libs/ua'
import { getNewExpandedItems } from './accordionPanelHelper'
import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'

import { FaCaretDownIcon } from '../Icon'

type Props = {
  children: React.ReactNode
  className?: string
}

export const AccordionPanelTrigger: FC<Props> = ({ children, className = '' }) => {
  const theme = useTheme()
  const { name } = useContext(AccordionPanelItemContext)
  const {
    iconPosition,
    displayIcon,
    expandedItems,
    onClickTrigger,
    onClickProps,
    expandableMultiply,
  } = useContext(AccordionPanelContext)

  const isExpanded = getIsInclude(expandedItems, name)
  const expandedClassName = isExpanded ? 'expanded' : ''
  const buttonClassNames = `${className} ${expandedClassName} ${iconPosition}`
  const iconClassNames = `${expandedClassName} ${iconPosition}`

  const handleClick = useCallback(() => {
    if (onClickTrigger) onClickTrigger(name, !isExpanded)

    if (onClickProps) {
      const newExpandedItems = getNewExpandedItems(
        expandedItems,
        name,
        !isExpanded,
        expandableMultiply,
      )
      onClickProps(mapToKeyArray(newExpandedItems))
    }
  }, [onClickTrigger, name, isExpanded, onClickProps, expandedItems, expandableMultiply])

  const caretIcon = <Icon className={iconClassNames} $theme={theme} />

  return (
    <Button
      id={`${name}-trigger`}
      className={buttonClassNames}
      aria-expanded={isExpanded}
      aria-controls={`${name}-content`}
      themes={theme}
      onClick={handleClick}
      type="button"
    >
      {displayIcon && iconPosition === 'left' && caretIcon}
      {children}
      {displayIcon && iconPosition === 'right' && caretIcon}
    </Button>
  )
}

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  appearance: none;
`
const Button = styled.button<{ themes: Theme }>`
  ${resetButtonStyle}
  ${({ themes }) => {
    const { size, palette, interaction } = themes

    return css`
      display: flex;
      align-items: center;
      width: 100%;
      padding: ${size.pxToRem(12)} ${size.pxToRem(size.space.XS)};
      color: ${palette.TEXT_BLACK};
      font-size: ${size.pxToRem(size.font.TALL)};
      text-align: left;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &:hover {
        background-color: ${palette.hoverColor('#fff')};
      }
      &.right {
        justify-content: space-between;
      }
      &.left {
        justify-content: left;
      }
    `
  }}
`
const Icon = styled(FaCaretDownIcon)<{ $theme: Theme }>`
  ${({ $theme }) => {
    const { size } = $theme

    return css`
      display: inline-flex;
      margin-right: ${size.pxToRem(size.space.XXS)};
      transition: transform 0.3s;

      &.left {
        &.expanded {
          transform: rotate(-180deg);
        }
      }

      &.right {
        margin-right: 0;
        margin-left: ${size.pxToRem(size.space.XXS)};

        &.expanded {
          transform: rotate(180deg);
        }
      }
    `
  }}
`
