import { type ComponentProps, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { colors, fontSize, textColor } from '../../themes'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { FontSizes } from '../../themes/createFontSize'
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

type AbstractProps = {
  /**アイコンの説明テキスト*/
  alt?: ReactNode
}
export type Props = AbstractProps &
  Omit<IconProps & Omit<ComponentProps<'svg'>, keyof IconProps>, keyof AbstractProps>

// HINT: smarthr-ui-Icon-extendedはアイコン+α(例えば複数のアイコンをまとめて一つにしているなど)を表すclass
// altなどもVisuallyHiddenTextで表現している関係上、squareの計算などの際に複数要素として判断されると認知と違う結果になるため使用しています

const classNameGenerator = tv({
  slots: {
    icon: 'smarthr-ui-Icon group-[]/iconWrapper:shr-shrink-0 group-[]/iconWrapper:shr-translate-y-[0.125em] forced-colors:shr-fill-[CanvasText]',
    wrapperWithAlt: 'smarthr-ui-Icon-extended smarthr-ui-Icon-withAlt shr-relative shr-leading-[0]',
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
      size,
      ...rest
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
          {...rest}
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

      if (alt) {
        return (
          // HINT: VisuallyHiddenTextが存在すると、アイコンなのに2つの要素がある状態になってしまい
          // styleなどを記述する際、意図しない状態になる場合がある
          // 回避するため、spanでラップし、開発者のメンタルモデルに合わせる
          <span className={classNames.wrapperWithAlt}>
            <VisuallyHiddenText>{alt}</VisuallyHiddenText>
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
