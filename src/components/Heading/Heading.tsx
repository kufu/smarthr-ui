import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme, Theme } from '../../hooks/useTheme'

export type Props = {
  children: string
  type?: 'screenTitle' | 'sectionTitle' | 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle'
  tag?: HeadingTagTypes
  className?: string
}

export type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'

export const Heading: FC<Props> = ({
  tag = 'h1' as HeadingTagTypes,
  type = 'ScreenTitle',
  className = '',
  children,
}) => {
  const theme = useTheme()

  return (
    <Wrapper as={tag} className={`${type} ${className}`} themes={theme}>
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
