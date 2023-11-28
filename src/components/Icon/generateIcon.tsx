import React, { useMemo } from 'react'
import { IconType } from 'react-icons'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTheme'
import { FontSizes } from '../../themes/createFontSize'
import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import { Gap } from '../../types'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

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

const icon = tv({
  base: 'smarthr-ui-Icon group-[]:shr-shrink-0 group-[]:shr-translate-y-[0.125em] forced-colors:shr-fill-[CanvasText]',
})

const wrapper = tv({
  base: ['smarthr-ui-Icon-withText shr-group shr-inline-flex shr-items-baseline'],
  variants: {
    gap: {
      0: 'shr-gap-x-0',
      0.25: 'shr-gap-x-0.25',
      0.5: 'shr-gap-x-0.5',
      0.75: 'shr-gap-x-0.75',
      1: 'shr-gap-x-1',
      1.25: 'shr-gap-x-1.25',
      1.5: 'shr-gap-x-1.5',
      2: 'shr-gap-x-2',
      2.5: 'shr-gap-x-2.5',
      3: 'shr-gap-x-3',
      3.5: 'shr-gap-x-3.5',
      4: 'shr-gap-x-4',
      8: 'shr-gap-x-8',
      '-0.25': '-shr-gap-x-0.25',
      '-0.5': '-shr-gap-x-0.5',
      '-0.75': '-shr-gap-x-0.75',
      '-1': '-shr-gap-x-1',
      '-1.25': '-shr-gap-x-1.25',
      '-1.5': '-shr-gap-x-1.5',
      '-2': '-shr-gap-x-2',
      '-2.5': '-shr-gap-x-2.5',
      '-3': '-shr-gap-x-3',
      '-3.5': '-shr-gap-x-3.5',
      '-4': '-shr-gap-x-4',
      '-8': '-shr-gap-x-8',
      X3S: 'shr-gap-x-0.25',
      XXS: 'shr-gap-x-0.5',
      XS: 'shr-gap-x-1',
      S: 'shr-gap-x-1.5',
      M: 'shr-gap-x-2',
      L: 'shr-gap-x-2.5',
      XL: 'shr-gap-x-3',
      XXL: 'shr-gap-x-3.5',
      X3L: 'shr-gap-x-4',
    } as { [key in Gap]: string },
  },
})

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

    const iconStyle = useMemo(() => icon({ className }), [className])
    const wrapperStyle = useMemo(() => wrapper({ gap: iconGap }), [iconGap])

    const theme = useTheme()
    const replacedColor = React.useMemo(() => {
      const asserted = color as string | undefined
      if (asserted && isDefinedColor(asserted)) {
        return theme.color[asserted]
      }
      return color
    }, [color, theme.color])

    const existsText = !!text
    const iconSize = size ? theme.fontSize[size] : '1em' // 指定がない場合は親要素のフォントサイズを継承する
    const svgIcon = (
      <SvgIcon
        {...props}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        // size は react-icons のアイコンの大きさ、width / height は自前で SVG からアイコンを作る場合の大きさ指定
        size={iconSize}
        width={iconSize}
        height={iconSize}
        color={replacedColor}
        className={iconStyle}
        role={role}
        aria-hidden={isAriaHidden || alt !== undefined || undefined}
        focusable={focusable}
      />
    )

    if (existsText) {
      return (
        <span className={wrapperStyle}>
          {alt && <VisuallyHiddenText>{alt}</VisuallyHiddenText>}
          {right && text}
          {svgIcon}
          {!right && text}
        </span>
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
