import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type Props = {
  children: ReactNode
  type?: HeadingTypes
  tag?: HeadingTagTypes
  className?: string
}

export type HeadingTypes =
  | 'screenTitle'
  | 'sectionTitle'
  | 'blockTitle'
  | 'subBlockTitle'
  | 'subSubBlockTitle'

export type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const Heading: VFC<Props & ElementProps> = ({
  tag = 'h1' as HeadingTagTypes,
  type = 'screenTitle',
  className = '',
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper
      as={tag}
      {...props}
      className={`${type} ${className} ${classNames.wrapper}`}
      themes={theme}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.h1<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, size } = themes

    return css`
      display: block;
      margin: 0;
      padding: 0;
      line-height: 1;

      &.screenTitle {
        color: ${palette.TEXT_BLACK};
        font-size: ${size.pxToRem(size.font.VENTI)};
        font-weight: normal;
      }

      &.sectionTitle {
        color: ${palette.TEXT_BLACK};
        font-size: ${size.pxToRem(size.font.GRANDE)};
        font-weight: normal;
      }

      &.blockTitle {
        color: ${palette.TEXT_BLACK};
        font-size: ${size.pxToRem(size.font.TALL)};
        font-weight: bold;
      }

      &.subBlockTitle {
        color: ${palette.TEXT_GREY};
        font-size: ${size.pxToRem(size.font.TALL)};
        font-weight: bold;
      }

      &.subSubBlockTitle {
        color: ${palette.TEXT_GREY};
        font-size: ${size.pxToRem(size.font.SHORT)};
        font-weight: bold;
      }
    `
  }}
`
