import React, { ComponentProps, useMemo } from 'react'
import { IconType } from 'react-icons'
import { tv } from 'tailwind-variants'

import { colors, fontSize, textColor } from '../../themes'
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

export const colorSet = {
  TEXT_BLACK: 'black',
  TEXT_WHITE: 'white',
  TEXT_GREY: 'grey',
  TEXT_DISABLED: 'disabled',
  TEXT_LINK: 'link',
  MAIN: 'main',
  DANGER: 'danger',
  WARNING: 'warning-yellow',
  BRAND: 'brand',
} as const

const existsColor = (color: string): color is keyof typeof colorSet => color in colorSet

const fontSizeMap = {
  XXS: '2xs',
  XS: 'xs',
  S: 'sm',
  M: 'base',
  L: 'lg',
  XL: 'xl',
  XXL: '2xl',
} as const

type IconProps = {
  /**
   * アイコンの色
   * @type string | 'TEXT_BLACK' | 'TEXT_GREY' | 'TEXT_DISABLED' | 'TEXT_LINK' | 'MAIN' | 'DANGER' | 'WARNING' | 'BRAND'
   */
  color?: LiteralUnion<keyof typeof colorSet>
  /**
   * アイコンの大きさ（フォントサイズの抽象値）
   * @deprecated 親要素やデフォルトフォントサイズが継承されるため固定値の指定は非推奨
   */
  size?: FontSizes
}

type ElementProps = Omit<ComponentProps<'svg'>, keyof IconProps>

type BaseComponentProps = {
  /**アイコンの説明テキスト*/
  alt?: React.ReactNode
  /** アイコンと並べるテキスト */
  text?: React.ReactNode
  /** アイコンと並べるテキストとの溝 */
  iconGap?: CharRelativeSize | AbstractSize
  /** `true` のとき、アイコンを右側に表示する */
  right?: boolean
}
export type Props = Omit<IconProps & ElementProps, keyof BaseComponentProps> & BaseComponentProps

const icon = tv({
  base: 'smarthr-ui-Icon group-[]/iconWrapper:shr-shrink-0 group-[]/iconWrapper:shr-translate-y-[0.125em] forced-colors:shr-fill-[CanvasText]',
})

const wrapper = tv({
  base: ['smarthr-ui-Icon-withText shr-group/iconWrapper shr-inline-flex shr-items-baseline'],
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
  const Icon: React.FC<Props> = ({
    color,
    className,
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

    const replacedColor = useMemo(() => {
      if (color && existsColor(color)) {
        const colorName = colorSet[color]

        if (colorName in textColor) {
          return textColor[colorName as keyof typeof textColor]
        }

        return colors[colorName as keyof typeof colors]
      }

      return color
    }, [color])

    const existsText = !!text
    const iconSize = size ? fontSize[fontSizeMap[size]] : '1em' // 指定がない場合は親要素のフォントサイズを継承する
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
