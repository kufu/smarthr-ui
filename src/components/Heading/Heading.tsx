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
  /**
   * @deprecated SectioningContent(Article, Aside, Nav, Section, SectioningFragment)を使ってHeadingと関連する範囲を明確に指定してください
   */
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

type ElementProps = Omit<
  HTMLAttributes<HTMLElement>,
  keyof Props | keyof TextProps | 'role' | 'aria-level'
>

const generateTagProps = (tag: HeadingTagTypes | undefined, level: number) => {
  const forwardedAs = tag || ((level <= 6 ? `h${level}` : 'span') as HeadingTagTypes)
  let role = undefined
  let ariaLevel = undefined

  if (level > 6) {
    role = 'heading'
    ariaLevel = level
  }

  return {
    forwardedAs,
    role,
    'aria-level': ariaLevel,
  }
}

const MAPPER_SIZE_AND_WEIGHT: { [key in HeadingTypes]: TextProps } = {
  screenTitle: {
    size: 'XL',
    weight: 'normal',
  },
  sectionTitle: {
    size: 'L',
    weight: 'normal',
  },
  blockTitle: {
    size: 'M',
    weight: 'bold',
  },
  subBlockTitle: {
    size: 'M',
    weight: 'bold',
    color: 'TEXT_GREY',
  },
  subSubBlockTitle: {
    size: 'S',
    weight: 'bold',
    color: 'TEXT_GREY',
  },
}

export const Heading: VFC<Props & ElementProps> = ({
  tag,
  type = 'screenTitle',
  className = '',
  ...props
}) => {
  const classNames = useClassNames()
  const level = useContext(LevelContext)
  const textProps = useMemo<TextProps>(() => MAPPER_SIZE_AND_WEIGHT[type], [type])
  const tagProps = useMemo(() => generateTagProps(tag, level), [tag, level])

  return (
    <ResetText
      {...props}
      {...textProps}
      {...tagProps}
      leading="TIGHT"
      className={`${type} ${className} ${classNames.wrapper}`}
    />
  )
}

const ResetText = styled(Text)`
  margin: unset;
`
