import React, { HTMLAttributes, ReactNode, VFC, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { LevelContext } from '../SectioningContent'
import { Text, TextProps } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

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
  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
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

const generateTagProps = (level: number, tag?: HeadingTagTypes, visuallyHidden?: boolean) => {
  let role = undefined
  let ariaLevel = undefined

  // TODO: h1はPageHeadingで設定するため、自動計算では必ずh2以下になるようにする
  if (!tag && level > 6) {
    role = 'heading'
    ariaLevel = level
  }

  return {
    [visuallyHidden ? 'as' : 'forwardedAs']:
      tag || ((level <= 6 ? `h${level}` : 'span') as HeadingTagTypes),
    role,
    'aria-level': ariaLevel,
  }
}

const MAPPER_SIZE_AND_WEIGHT: { [key in HeadingTypes]: TextProps } = {
  screenTitle: {
    size: 'XL',
  },
  sectionTitle: {
    size: 'L',
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
  type = 'sectionTitle',
  className = '',
  visuallyHidden,
  ...props
}) => {
  const classNames = useClassNames()
  const level = useContext(LevelContext)
  const tagProps = useMemo(
    () => generateTagProps(level, tag, visuallyHidden),
    [level, tag, visuallyHidden],
  )
  const actualProps = {
    ...props,
    ...MAPPER_SIZE_AND_WEIGHT[type],
    ...tagProps,
    className: `${type} ${className} ${classNames.wrapper}`,
  }

  return visuallyHidden ? <VisuallyHiddenText {...actualProps} /> : <ResetText {...actualProps} />
}

export const PageHeading: VFC<Omit<Props & ElementProps, 'visuallyHidden' | 'tag'>> = ({
  type = 'screenTitle',
  ...props
}) => <Heading {...props} type={type} tag="h1" /> // eslint-disable-line smarthr/a11y-heading-in-sectioning-content

const ResetText = styled(Text).attrs(() => ({
  leading: 'TIGHT' as React.ComponentProps<typeof Text>['leading'],
}))`
  margin: unset;
`
