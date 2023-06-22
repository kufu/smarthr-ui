import React, { HTMLAttributes, ReactNode, VFC, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { LevelContext } from '../SectioningContent'
import { Text, TextProps } from '../Text'

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

export type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'legend'

type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props | keyof TextProps>

function generateTagAttribute(level: number): HeadingTagTypes {
  if (level <= 6) {
    return `h${level}` as HeadingTagTypes
  }

  return 'span'
}

export function extractLevel(tag: HeadingTagTypes) {
  const reg = tag.match(/^h([1-6])$/)

  return reg ? parseInt(reg[1], 10) : 7 // HINT: 数値が取れない場合h6以下、つまりspanかlegendになる
}

export const Heading: VFC<Props & ElementProps> = ({
  tag,
  type = 'screenTitle',
  className = '',
  ...props
}) => {
  const classNames = useClassNames()
  const level = useContext(LevelContext)
  const textProps = useMemo<TextProps>(() => {
    switch (type) {
      case 'screenTitle':
        return {
          size: 'XL',
          weight: 'normal',
        }
      case 'sectionTitle':
        return {
          size: 'L',
          weight: 'normal',
        }
      case 'blockTitle':
        return {
          size: 'M',
          weight: 'bold',
        }
      case 'subBlockTitle':
        return {
          size: 'M',
          weight: 'bold',
          color: 'TEXT_GREY',
        }
      case 'subSubBlockTitle':
        return {
          size: 'S',
          weight: 'bold',
          color: 'TEXT_GREY',
        }
    }
  }, [type])

  return (
    <ResetText
      {...props}
      {...textProps}
      forwardedAs={tag || generateTagAttribute(level)}
      leading="TIGHT"
      className={`${type} ${className} ${classNames.wrapper}`}
    />
  )
}

const ResetText = styled(Text)`
  margin: unset;
`
