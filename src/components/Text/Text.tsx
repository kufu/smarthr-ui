import React, { CSSProperties, ComponentType, HTMLAttributes, ReactComponentElement } from 'react'
import styled, { css } from 'styled-components'
import { useTheme } from '../../hooks/useTheme'
import { FontSizes } from '../../themes/createFontSize'
import { TextColors } from '../../themes/createColor'
import { Leadings } from '../../themes/createLeading'
import { ComponentProps as IconProps } from '../Icon'
import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import { useSpacing } from '../../hooks/useSpacing'

export type TextProps = {
  /** フォントサイズの抽象値（font-size） */
  size?: FontSizes
  /** フォントウェイト（font-weight） */
  weight?: CSSProperties['fontWeight']
  /** 斜体にするかどうかの真偽値（font-style: italic） */
  italic?: boolean
  /** 色。初期値は inherit（color、） */
  color?: TextColors | 'inherit'
  /** 行送りの抽象値（line-height） */
  leading?: Leadings
  /** ホワイトスペース（white-space） */
  whiteSpace?: CSSProperties['whiteSpace']
  /** 強調するかどうかの真偽値。指定すると em 要素になる */
  emphasis?: boolean
  /** テキストコンポーネントの HTML タグ名。初期値は span */
  as?: string | ComponentType<any> | undefined
}
type WithIconProps = {
  /** テキストの前につけるアイコン */
  prefixIcon?: ReactComponentElement<ComponentType<IconProps>>
  /** テキストの後ろにつけるアイコン */
  suffixIcon?: ReactComponentElement<ComponentType<IconProps>>
  /** テキストとアイコンの間隔 */
  iconGap?: CharRelativeSize | AbstractSize
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof TextProps | keyof WithIconProps>

export type Props = TextProps &
  WithIconProps &
  ElementProps & {
    children: React.ReactNode
  }

/* https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements */
const BlockLevelElement = [
  'blockquote',
  'details',
  'dialog',
  'dd',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1 , h2 , h3 , h4 , h5 , h6',
  'header',
  'hgroup',
  'hr',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'ul',
] as const
type BlockLevelElementType = typeof BlockLevelElement[number]

export const Text: React.VFC<Props> = ({
  as = 'span',
  prefixIcon,
  suffixIcon,
  children,
  ...props
}) => (
  <Wrapper {...props} as={props.emphasis ? 'em' : as} existsIcon={prefixIcon || suffixIcon}>
    {prefixIcon && React.cloneElement(prefixIcon, { className: '--prefix' })}
    {children}
    {suffixIcon && React.cloneElement(suffixIcon, { className: '--suffix' })}
  </Wrapper>
)

const Wrapper = styled.span<
  TextProps & { existsIcon?: boolean; iconGap?: CharRelativeSize | AbstractSize }
>(
  ({
    size,
    weight = 'normal',
    italic,
    color = 'inherit',
    leading = 'NORMAL',
    whiteSpace,
    emphasis,
    as,
    existsIcon = false,
    iconGap = 0.25,
  }) => {
    const { color: shrColor, fontSize, leading: shrLeading } = useTheme()
    return css`
      ${whiteSpace && `white-space: ${whiteSpace};`}
      font-size: ${size ? fontSize[size] : 'inherit'};
      line-height: ${shrLeading[leading]};
      font-weight: ${emphasis ? 'bold' : weight};
      ${italic && `font-style: italic;`}
      color: ${color === 'inherit' ? color : shrColor[color]};

      ${existsIcon &&
      css`
        /* ブロックレベル要素以外はインライン要素として振る舞ってほしい */
        display: ${typeof as === 'string' && BlockLevelElement.includes(as as BlockLevelElementType)
          ? 'flex'
          : 'inline-flex'};
        align-items: center;

        > .--prefix {
          margin-inline-end: ${useSpacing(iconGap)};
        }
        > .--suffix {
          margin-inline-start: ${useSpacing(iconGap)};
        }
      `}
    `
  },
)
