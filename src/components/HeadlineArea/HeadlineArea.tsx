import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Heading, Props as HeadingProps } from '../Heading'
import { Section } from '../SectioningContent'

import { useClassNames } from './useClassNames'

type Props = {
  /** 見出し領域に表示する内容 */
  heading: {
    /** 見出しの内容 */
    children: HeadingProps['children']
    /** 見出しの HTML タグ */
    tag?: HeadingProps['tag']
  }
  /** 説明テキスト */
  description?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

/**
 * @deprecated `HeadlineArea` は非推奨です。`Stack` で書き換えてください。
 */
export const HeadlineArea: VFC<Props & ElementProps> = ({
  heading,
  description,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <WrapperSection {...props} theme={theme} className={`${className} ${classNames.wrapper}`}>
      <Heading type="screenTitle" tag={heading.tag ? heading.tag : 'h1'}>
        {heading.children}
      </Heading>
      {description && (
        <Description themes={theme} className={classNames.description}>
          {description}
        </Description>
      )}
    </WrapperSection>
  )
}

const WrapperSection = styled(Section)`
  display: block;
  margin: 0;
  padding: 0;
`
const Description = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { fontSize, spacingByChar, color } = themes

    return css`
      margin-top: ${spacingByChar(1)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      line-height: 1.5;
    `
  }}
`
