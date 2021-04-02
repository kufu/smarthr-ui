import React, { ButtonHTMLAttributes, VFC, useCallback, useContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { getIsInclude, mapToKeyArray } from '../../libs/map'
import { getNewExpandedItems } from './accordionPanelHelper'
import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import { useClassNames } from './useClassNames'
import { Heading, HeadingTagTypes, HeadingTypes } from '../Heading'
import { FaCaretDownIcon } from '../Icon'

type Props = {
  children: React.ReactNode
  className?: string
  headingType?: HeadingTypes
  headingTag?: HeadingTagTypes
}
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props>

export const AccordionPanelTrigger: VFC<Props & ElementProps> = ({
  children,
  className = '',
  headingType = 'blockTitle',
  headingTag,
  ...props
}) => {
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
  const classNames = useClassNames()

  const isExpanded = getIsInclude(expandedItems, name)
  const buttonClassNames = `${className} ${classNames.trigger}`

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

  return (
    <Heading tag={headingTag} type={headingType}>
      <Button
        id={`${name}-trigger`}
        className={buttonClassNames}
        aria-expanded={isExpanded}
        aria-controls={`${name}-content`}
        themes={theme}
        onClick={handleClick}
        type="button"
        data-component="AccordionHeaderButton"
        {...props}
      >
        {displayIcon && iconPosition === 'left' && <Icon />}
        <TriggerTitle>{children}</TriggerTitle>
        {displayIcon && iconPosition === 'right' && <Icon />}
      </Button>
    </Heading>
  )
}

const TriggerTitle = styled.span`
  flex-grow: 1;
`

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  padding: 0;
  appearance: none;
`
const Button = styled.button<{ themes: Theme }>`
  ${resetButtonStyle}
  ${({ themes }) => {
    const { color, fontSize, spacing } = themes

    return css`
      display: flex;
      align-items: center;
      width: 100%;
      padding: ${fontSize.pxToRem(12)} ${fontSize.pxToRem(spacing.XS)};
      cursor: pointer;
      font-size: inherit;
      outline-color: ${color.OUTLINE};
      text-align: left;

      &:hover,
      &:focus {
        background-color: ${color.hoverColor('#fff')};
      }

      /* TODO replace if impremented Layout component */
      & > * + * {
        margin-left: ${fontSize.pxToRem(spacing.XXS)};
      }
    `
  }}
`
const Icon = styled(FaCaretDownIcon)`
  transition: transform 0.3s;

  [aria-expanded='true'] > & {
    transform: rotate(-180deg);
  }

  [aria-expanded='true'] &:last-child {
    transform: rotate(180deg);
  }
`
