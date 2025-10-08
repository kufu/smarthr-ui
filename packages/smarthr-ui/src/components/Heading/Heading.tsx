'use client'

import { type ComponentProps, type PropsWithChildren, memo, useContext, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { LevelContext } from '../SectioningContent'
import { STYLE_TYPE_MAP, Text, type TextProps } from '../Text'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

export type HeadingTagTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type StylingProps =
  | {
      /** テキストのスタイル */
      type?: Extract<TextProps['styleType'], 'sectionTitle'>

      /**
       * テキストのサイズ
       *
       * `sectionTitle`の場合、`XXL`か`XL`か`L`を指定してください
       *
       * @default 'L'
       */
      size?: Extract<TextProps['size'], 'XXL' | 'XL' | 'L'>
    }
  | {
      /** テキストのスタイル
       *
       * screenTitleを使用する場合、PageHeadingコンポーネントを使用してください
       * */
      type: Exclude<TextProps['styleType'], 'screenTitle' | 'sectionTitle'>
      size?: never
    }

export type Props = PropsWithChildren<{
  /**
   * @deprecated SectioningContent(Article, Aside, Nav, Section)を使ってHeadingと関連する範囲を明確に指定してください
   */
  tag?: HeadingTagTypes

  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
}> &
  StylingProps

export type ElementProps = Omit<
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
  ({ tag, type = 'sectionTitle', size, className, visuallyHidden, ...props }) => {
    const level = useContext(LevelContext)
    const tagProps = useMemo(() => generateTagProps(level, tag), [level, tag])
    const actualClassName = useMemo(
      () => classNameGenerator({ visuallyHidden, className }),
      [className, visuallyHidden],
    )
    const actualTypography = useMemo(() => {
      const defaultTypography = STYLE_TYPE_MAP[type]
      if (size && type === 'sectionTitle') {
        return { ...defaultTypography, size }
      }
      return defaultTypography
    }, [type, size])
    const Component = visuallyHidden ? VisuallyHiddenText : Text

    return <Component {...props} {...actualTypography} {...tagProps} className={actualClassName} />
  },
)
