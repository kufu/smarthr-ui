import React, { useContext } from 'react'
import { withTheme, InjectedProps } from '../../hocs/withTheme'
import { AccordionContext } from './Accordion'
import styled, { css } from 'styled-components'
import { isTouchDevice } from '../../libs/ua'
import { Icon as IconComponent } from '../Icon'

type Props = {
  children: React.ReactNode
  className?: string
  icon?: 'left' | 'right' | 'none'
}

type MergedProps = Props & InjectedProps

const AccordionTriggerComponent: React.SFC<MergedProps> = ({
  children,
  className = '',
  icon = 'left',
  theme,
}) => {
  const { expanded, name, onClick } = useContext(AccordionContext)

  const expandedClassName = expanded ? 'expanded' : ''
  const buttonClassNames = `${className} ${expandedClassName} ${icon}`
  const iconClassNames = `${expandedClassName} ${icon}`

  const caretIcon = <Icon className={iconClassNames} name="fa-caret-up" theme={theme} />

  const handleClick = () => {
    return onClick(name, !expanded)
  }

  return (
    <Button
      id={`${name}-trigger`}
      className={buttonClassNames}
      aria-expanded={!!expanded}
      aria-controls={`${name}-content`}
      onClick={handleClick}
      theme={theme}
    >
      {icon === 'left' && caretIcon}
      {children}
      {icon === 'right' && caretIcon}
    </Button>
  )
}

export const AccordionTrigger = withTheme(AccordionTriggerComponent)

const resetButtonStyle = css`
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  appearance: none;
`
const Button = styled.button`
  ${resetButtonStyle}
  ${({ theme }: InjectedProps) => {
    const { size, palette, interaction } = theme

    return css`
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 ${size.pxToRem(size.space.XS)};
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
const Icon = styled(IconComponent)`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      display: inline-flex;
      margin-right: ${size.pxToRem(size.space.XXS)};
      transition: transform 0.3s;

      &.expanded {
        transform: rotate(180deg);
      }

      &.right {
        margin-right: 0;
        margin-left: ${size.pxToRem(size.space.XXS)};
      }
    `
  }}
`
