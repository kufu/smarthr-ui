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

export type AbstractProps = PropsWithChildren<{
  /**
   * 可能な限り利用せず、SectioningContent(Article, Aside, Nav, Section)を使ってHeadingと関連する範囲を明確に指定する方法を検討してください
   */
  unrecommendedTag?: HeadingTagTypes
  /** 視覚的に非表示にするフラグ */
  visuallyHidden?: boolean
  /** テキスト左に設置するアイコン */
  icon?: ComponentProps<typeof Text>['icon']
}> &
  StylingProps

export type ElementProps = Omit<
  ComponentProps<'h1'>,
  keyof AbstractProps | keyof TextProps | 'role' | 'aria-level'
>
type Props = AbstractProps & ElementProps

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

export const Heading = memo<Props>(
  ({ unrecommendedTag, type = 'sectionTitle', size, className, visuallyHidden, icon, ...rest }) => {
    const level = useContext(LevelContext)

    let role = undefined
    let ariaLevel = undefined

    // TODO: h1はPageHeadingで設定するため、自動計算では必ずh2以下になるようにする
    if (!unrecommendedTag && level > 6) {
      role = 'heading'
      ariaLevel = level
    }
    const as = unrecommendedTag || ((level <= 6 ? `h${level}` : 'span') as HeadingTagTypes | 'span')

    const actualClassName = useMemo(
      () => classNameGenerator({ visuallyHidden, className }),
      [className, visuallyHidden],
    )
    let typography = STYLE_TYPE_MAP[type]

    if (type === 'sectionTitle' && size) {
      typography = { ...typography, size }
    }

    const commonProps = {
      as,
      role,
      'aria-level': ariaLevel,
      className: actualClassName,
    }

    if (visuallyHidden) {
      return <VisuallyHiddenText {...rest} {...typography} {...commonProps} />
    }

    return <Text {...rest} {...typography} {...commonProps} icon={icon} />
  },
)
