import { type ComponentProps, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { colors, fontSize, textColor } from '../../themes'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { FontSizes } from '../../themes/createFontSize'
import type { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import type { Gap } from '../../types'
import type { IconType } from 'react-icons'

/**
 * literal union type に補完を効かせるためのハック
 * https://github.com/microsoft/TypeScript/issues/29729
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>)

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
  alt?: ReactNode
  /** アイコンと並べるテキスト */
  text?: ReactNode
  /** アイコンと並べるテキストとの溝 */
  iconGap?: CharRelativeSize | AbstractSize
  /** `true` のとき、アイコンを右側に表示する */
  right?: boolean
}
export type Props = Omit<IconProps & ElementProps, keyof BaseComponentProps> & BaseComponentProps

// HINT: smarthr-ui-Icon-extendedはアイコン+α(例えば複数のアイコンをまとめて一つにしているなど)を表すclass
// altなどもVisuallyHiddenTextで表現している関係上、squareの計算などの際に複数要素として判断されると認知と違う結果になるため使用しています

const classNameGenerator = tv({
  slots: {
    icon: 'smarthr-ui-Icon group-[]/iconWrapper:shr-shrink-0 group-[]/iconWrapper:shr-translate-y-[0.125em] forced-colors:shr-fill-[CanvasText]',
    wrapperWithAlt: 'smarthr-ui-Icon-extended smarthr-ui-Icon-withAlt shr-leading-[0]',
  },
})

const wrapperClassNameGenerator = tv({
  base: [
    'smarthr-ui-Icon-extended smarthr-ui-Icon-withText shr-group/iconWrapper shr-inline-flex shr-items-baseline',
  ],
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

export const generateIcon = (SvgIcon: IconType) => {
  const Icon = memo<Props>(
    ({
      color,
      className,
      role = 'img',
      alt,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      focusable = false,
      text,
      iconGap = 0.25,
      right,
      size,
      ...props
    }) => {
      const actualAriaHidden = useMemo(() => {
        if (ariaHidden !== undefined) {
          return ariaHidden
        }

        if (alt !== undefined || (ariaLabel === undefined && ariaLabelledby === undefined)) {
          return true
        }

        return undefined
      }, [ariaHidden, alt, ariaLabel, ariaLabelledby])

      const classNames = useMemo(() => {
        const { icon, wrapperWithAlt } = classNameGenerator()

        return {
          icon: icon({ className }),
          wrapperWithAlt: wrapperWithAlt(),
        }
      }, [className])
      const wrapperClassName = useMemo(() => wrapperClassNameGenerator({ gap: iconGap }), [iconGap])

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
          className={classNames.icon}
          role={role}
          aria-hidden={actualAriaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          focusable={focusable}
        />
      )
      const visuallyHiddenAlt = alt && <VisuallyHiddenText>{alt}</VisuallyHiddenText>

      if (text) {
        return (
          <span className={wrapperClassName}>
            {right && text}
            {visuallyHiddenAlt}
            {svgIcon}
            {!right && text}
          </span>
        )
      }

      if (visuallyHiddenAlt) {
        return (
          // HINT: visuallyが存在すると、アイコンなのに2つの要素がある状態になってしまい
          // styleなどを記述する際、意図しない状態になる場合がある
          // 回避するため、spanでラップし、開発者のメンタルモデルに合わせる
          <span className={classNames.wrapperWithAlt}>
            {visuallyHiddenAlt}
            {svgIcon}
          </span>
        )
      }

      return svgIcon
    },
  )

  Icon.displayName = SvgIcon.name

  return Icon
}
