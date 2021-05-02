import React from 'react'
import styled, { css } from 'styled-components'
import { useTheme } from '../../hooks/useTheme'
import { FontSizes } from '../../themes/createFontSize'
import { TextColors } from '../../themes/createColor'
import { Leadings } from '../../themes/createLeading'

export interface TextProps {
  size?: FontSizes
  weight?: 'normal' | 'bold'
  italic?: boolean
  color?: TextColors | 'inherit'
  leading?: Leadings
  emphasis?: boolean
}

export const Text: React.VFC<
  TextProps & {
    children: React.ReactNode
    as?: React.ElementType
  }
> = ({ as = 'span', ...props }) => {
  return <Wrapper as={props.emphasis ? 'em' : as} {...props} />
}

const Wrapper = styled.span<TextProps>(
  ({
    size = 'M',
    weight = 'normal',
    italic = false,
    color = 'inherit',
    leading = 'NORMAL',
    emphasis,
  }) => {
    const { color: shrColor, fontSize, leading: shrLeading } = useTheme()
    return css`
      font-size: ${fontSize[size]};
      line-height: ${shrLeading[leading]};
      font-weight: ${emphasis ? 'bold' : weight};
      ${italic && `font-style: italic;`}
      color: ${color === 'inherit' ? color : shrColor[color]};
    `
  },
)
