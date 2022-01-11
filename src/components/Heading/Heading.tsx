import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

export type Props = {
  /** 表示するテキスト */
  children: ReactNode
  /** テキストのスタイル */
  type?: HeadingTypes
  /** コンポーネントの HTML タグ */
  tag?: HeadingTagTypes
  /** コンポーネントに適用するクラス名 */
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
  tag = 'h1',
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
    const { color, fontSize } = themes

    return css`
      display: block;
      margin: 0;
      padding: 0;
      line-height: 1;

      &.screenTitle {
        color: ${color.TEXT_BLACK};
        font-size: ${fontSize.XL};
        font-weight: normal;
      }

      &.sectionTitle {
        color: ${color.TEXT_BLACK};
        font-size: ${fontSize.L};
        font-weight: normal;
      }

      &.blockTitle {
        color: ${color.TEXT_BLACK};
        font-size: ${fontSize.M};
        font-weight: bold;
      }

      &.subBlockTitle {
        color: ${color.TEXT_GREY};
        font-size: ${fontSize.M};
        font-weight: bold;
      }

      &.subSubBlockTitle {
        color: ${color.TEXT_GREY};
        font-size: ${fontSize.S};
        font-weight: bold;
      }
    `
  }}
`
