import React, { ButtonHTMLAttributes, VFC, useCallback, useContext } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { getIsInclude, mapToKeyArray } from '../../libs/map'
import { getNewExpandedItems } from './accordionPanelHelper'
import { AccordionPanelContext } from './AccordionPanel'
import { AccordionPanelItemContext } from './AccordionPanelItem'
import { useClassNames } from './useClassNames'
import { Heading, HeadingTagTypes, HeadingTypes } from '../Heading'
import { FaCaretRightIcon, FaCaretUpIcon } from '../Icon'
import { radiusMap } from '../Base'

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
        {displayIcon && iconPosition === 'left' && <LeftIcon />}
        <TriggerTitle>{children}</TriggerTitle>
        {displayIcon && iconPosition === 'right' && <RightIcon />}
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
    const { color, spacingByChar, shadow } = themes

    return css`
      display: flex;
      align-items: center;
      width: 100%;
      padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      cursor: pointer;
      font-size: inherit;
      text-align: left;

      .smarthr-ui-AccordionPanel > * > *:first-child & {
        border-radius: ${radiusMap.m} ${radiusMap.m} 0 0;
      }

      .smarthr-ui-AccordionPanel > * > *:last-child & {
        border-radius: 0 0 ${radiusMap.m} ${radiusMap.m};
      }

      &:focus {
        outline: none;
        box-shadow: ${shadow.OUTLINE};
      }

      &:hover,
      &:focus:not(:focus-visible) {
        background-color: ${color.hoverColor('#fff')};
        box-shadow: none;
      }

      /* TODO replace if impremented Layout component */
      & > * + * {
        margin-left: ${spacingByChar(0.5)};
      }
    `
  }}
`
const LeftIcon = styled(FaCaretRightIcon)`
  transition: transform 0.3s;

  [aria-expanded='true'] > & {
    transform: rotate(90deg);
  }
`

const RightIcon = styled(FaCaretUpIcon)`
  transition: transform 0.3s;

  [aria-expanded='true'] & {
    transform: rotate(-180deg);
  }
`
