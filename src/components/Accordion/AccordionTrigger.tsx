import React, { useContext } from 'react'
import { withTheme, InjectedProps } from '../../hocs/withTheme'
import { AccordionContext } from './Accordion'
import styled, { css } from 'styled-components'

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

  const handleClick = () => {
    return onClick(name, !expanded)
  }

  return (
    <Button
      onClick={handleClick}
      className={`${className} ${expanded ? 'expanded' : ''}`}
      theme={theme}
    >
      {prefix && <Prefix theme={theme}>{prefix}</Prefix>}
      {children}
      {suffix && <Suffix theme={theme}>{suffix}</Suffix>}
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
    const { size, palette } = theme

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
    `
  }}
`

const Prefix = styled.span`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      display: inline-flex;
      margin-right: ${size.pxToRem(size.space.XXS)};
    `
  }}
`
const Suffix = styled.span`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      display: inline-flex;
      margin-left: ${size.pxToRem(size.space.XXS)};
    `
  }}
`
