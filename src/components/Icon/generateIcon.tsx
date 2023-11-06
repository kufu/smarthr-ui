import React from 'react'
import { IconType } from 'react-icons'
import styled, { css } from 'styled-components'

import { useSpacing } from '../../hooks/useSpacing'
import { useTheme } from '../../hooks/useTheme'
import { FontSizes } from '../../themes/createFontSize'
import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { useClassNames } from './useClassNames'

/**
 * literal union type に補完を効かせるためのハック
 * https://github.com/microsoft/TypeScript/issues/29729
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>)

export const generateIcon = (svg: IconType) => createIcon(svg)

const definedColors = [
  'TEXT_BLACK',
  'TEXT_WHITE',
  'TEXT_GREY',
  'TEXT_DISABLED',
  'TEXT_LINK',
  'MAIN',
  'DANGER',
  'WARNING',
  'BRAND',
] as const
type DefinedColor = (typeof definedColors)[number]

const knownColorSet: Set<string> = new Set(definedColors)
const isDefinedColor = (color: string): color is DefinedColor => knownColorSet.has(color)

type IconProps = {
  /**
   * アイコンの色
   * @type string | 'TEXT_BLACK' | 'TEXT_GREY' | 'TEXT_DISABLED' | 'TEXT_LINK' | 'MAIN' | 'DANGER' | 'WARNING' | 'BRAND'
   */
  color?: LiteralUnion<DefinedColor>
  /**
   * アイコンの大きさ（フォントサイズの抽象値）
   * @deprecated 親要素やデフォルトフォントサイズが継承されるため固定値の指定は非推奨
   */
  size?: FontSizes
}

type ElementProps = Omit<React.SVGAttributes<SVGAElement>, keyof IconProps>

type BaseComponentProps = {
  /**アイコンの説明テキスト*/
  alt?: React.ReactNode
  /** アイコンと並べるテキスト */
  text?: React.ReactNode
  /** アイコンと並べるテキストとの溝 */
  iconGap?: CharRelativeSize | AbstractSize
  /** `true` のとき、アイコンを右側に表示する */
  right?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
}
export type ComponentProps = Omit<IconProps & ElementProps, keyof BaseComponentProps> &
  BaseComponentProps

export const createIcon = (SvgIcon: IconType) => {
  const Icon: React.FC<ComponentProps> = ({
    color,
    className = '',
    role = 'img',
    alt,
    'aria-hidden': ariaHidden,
    focusable = false,
    text,
    iconGap = 0.25,
    right = false,
    size,
    ...props
  }) => {
    const hasLabelByAria =
      props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined
    const isAriaHidden = ariaHidden !== undefined ? ariaHidden : !hasLabelByAria

    const theme = useTheme()
    const replacedColor = React.useMemo(() => {
      const asserted = color as string | undefined
      if (asserted && isDefinedColor(asserted)) {
        return theme.color[asserted]
      }
      return color
    }, [color, theme.color])

    const classNames = useClassNames()

    const existsText = !!text
    const iconSize = size ? theme.fontSize[size] : '1em' // 指定がない場合は親要素のフォントサイズを継承する
    const svgIcon = (
      <WrapIcon
        {...props}
        as={SvgIcon}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        // size は react-icons のアイコンの大きさ、width / height は自前で SVG からアイコンを作る場合の大きさ指定
        size={iconSize}
        width={iconSize}
        height={iconSize}
        color={replacedColor}
        className={`${className} ${classNames.wrapper}`}
        role={role}
        aria-hidden={isAriaHidden || alt !== undefined || undefined}
        focusable={focusable}
      />
    )

    if (existsText) {
      return (
        <IconAndTextWrapper gap={iconGap} right={right} className={classNames.withText}>
          {alt && <VisuallyHiddenText>{alt}</VisuallyHiddenText>}
          {right && text}
          {svgIcon}
          {!right && text}
        </IconAndTextWrapper>
      )
    }

    return (
      <>
        {alt && <VisuallyHiddenText>{alt}</VisuallyHiddenText>}
        {svgIcon}
      </>
    )
  }

  Icon.displayName = SvgIcon.name

  return Icon
}

const WrapIcon = styled.svg`
  @media (forced-colors: active) {
    fill: CanvasText;
  }
`

const IconAndTextWrapper = styled.span<{
  right: ComponentProps['right']
  gap: ComponentProps['iconGap']
}>`
  ${({ right, gap }) => css`
    ${!right &&
    css`
      display: inline-flex;
      align-items: baseline;
      ${gap && `column-gap: ${useSpacing(gap)};`}
    `}

    .smarthr-ui-Icon {
      flex-shrink: 0;
      transform: translateY(0.125em);
      ${right && gap && `margin-inline-start: ${useSpacing(gap)};`}
    }
  `}
`
