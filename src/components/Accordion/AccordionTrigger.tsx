import React, { useContext } from 'react'
import { withTheme, InjectedProps } from '../../hocs/withTheme'
import { AccordionContext } from './Accordion'
import styled, { css } from 'styled-components'
import { isTouchDevice } from '../../libs/ua'

type Props = {
  children: React.ReactNode
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

type MergedProps = Props & InjectedProps

const AccordionTriggerComponent: React.SFC<MergedProps> = ({
  children,
  className = '',
  prefix = '',
  suffix = '',
  theme,
}) => {
  const { expanded, name, onClick } = useContext(AccordionContext)
  const expandedClassName = expanded ? 'expanded' : ''

  // prettier-ignore
  const classNames = `${className} ${expandedClassName} ${prefix ? 'prefix' : ''} ${suffix ? 'suffix' : ''}`

  const handleClick = () => {
    return onClick(name, !expanded)
  }

  return (
    <Button onClick={handleClick} className={classNames} theme={theme}>
      {prefix && (
        <Prefix className={expandedClassName} theme={theme}>
          {prefix}
        </Prefix>
      )}
      {children}
      {suffix && (
        <Suffix className={expandedClassName} theme={theme}>
          {suffix}
        </Suffix>
      )}
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
      display:flex;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 ${size.pxToRem(size.space.XS)}
      color: ${palette.TEXT_BLACK};
      font-size: ${size.pxToRem(size.font.TALL)};
      text-align: left;
      cursor: pointer;
      transition: ${isTouchDevice ? 'none' : `all ${interaction.hover.animation}`};

      &:hover {
        background-color: ${palette.hoverColor('#fff')};
      }

      &.suffix {
        justify-content: space-between;
      }

      &.prefix {
        justify-content: left;
      }
    `
  }}
`

const Prefix = styled.span`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      display: inline-flex;
      margin-right: ${size.pxToRem(size.space.XXS)};
      transition: all 0.3s;

      &.expanded {
        transform: rotate(180deg);
      }
    `
  }}
`
const Suffix = styled.span`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      display: inline-flex;
      margin-left: ${size.pxToRem(size.space.XXS)};
      transition: all 0.3s;

      &.expanded {
        transform: rotate(180deg);
      }
    `
  }}
`
