'use client'

import React, {
  type ComponentProps,
  type PropsWithChildren,
  memo,
  useContext,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { LevelContext } from '../SectioningContent'
import { STYLE_TYPE_MAP, Text, type TextProps } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

export type Props = PropsWithChildren<{
  /** テキストのスタイル */
  type?: TextProps['styleType']
  /**
   * @deprecated SectioningContent(Article, Aside, Nav, Section)を使ってHeadingと関連する範囲を明確に指定してください
   */
  tag?: HeadingTagTypes
  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
}>

export type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type ElementProps = Omit<
  ComponentProps<'h1'>,
  keyof Props | keyof TextProps | 'role' | 'aria-level'
>

const generateTagProps = (level: number, tag?: HeadingTagTypes) => {
  let role = undefined
  let ariaLevel = undefined

  // TODO: h1はPageHeadingで設定するため、自動計算では必ずh2以下になるようにする
  if (!tag && level > 6) {
    role = 'heading'
    ariaLevel = level
  }

  return {
    as: tag || ((level <= 6 ? `h${level}` : 'span') as HeadingTagTypes | 'span'),
    role,
    'aria-level': ariaLevel,
  }
}

const classNameGenerator = tv({
  base: 'smarthr-ui-Heading',
  variants: {
    visuallyHidden: {
      false: 'shr-m-[unset]',
    },
  },
  defaultVariants: {
    visuallyHidden: false,
  },
})

export const Heading = memo<Props & ElementProps>(
  ({ tag, type = 'sectionTitle', className, visuallyHidden, ...props }) => {
    const level = useContext(LevelContext)
    const tagProps = useMemo(() => generateTagProps(level, tag), [level, tag])
    const actualClassName = useMemo(
      () => classNameGenerator({ visuallyHidden, className }),
      [className, visuallyHidden],
    )
    const Component = visuallyHidden ? VisuallyHiddenText : Text

    return (
      <Component {...props} {...STYLE_TYPE_MAP[type]} {...tagProps} className={actualClassName} />
    )
  },
)

export const PageHeading = memo<Omit<Props & ElementProps, 'visuallyHidden' | 'tag'>>(
  ({ type = 'screenTitle', ...props }) => (
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Heading {...props} type={type} tag="h1" />
  ),
)
