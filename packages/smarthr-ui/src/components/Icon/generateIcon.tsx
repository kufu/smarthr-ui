import { type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { color as defaultColorPalette, textColor } from '../../tailwind'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import type { ExtendElementPropsWithRef } from '../../types'
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

export type Props = ExtendElementPropsWithRef<
  'svg',
  {
    /**アイコンの説明テキスト*/
    alt?: ReactNode
    /**
     * アイコンの色
     * @type string | 'TEXT_BLACK' | 'TEXT_GREY' | 'TEXT_DISABLED' | 'TEXT_LINK' | 'MAIN' | 'DANGER' | 'WARNING' | 'BRAND'
     */
    color?: LiteralUnion<keyof typeof colorSet>
  },
  { omit: 'stroke' | 'fill' | 'strokeWidth' | 'width' | 'height' | 'children' }
>

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
      ...rest
    }) => {
      const actualAriaHidden =
        ariaHidden !== undefined
          ? ariaHidden
          : alt !== undefined || (ariaLabel === undefined && ariaLabelledby === undefined)
            ? true
            : undefined
      const replacedColor =
        color && existsColor(color)
          ? colorSet[color] in textColor
            ? textColor[colorSet[color] as keyof typeof textColor]
            : (defaultColorPalette[colorSet[color] as keyof typeof defaultColorPalette] as string)
          : color

      const classNames = useMemo(() => {
        const { icon, wrapperWithAlt } = classNameGenerator()

        return {
          icon: icon({ className }),
          wrapperWithAlt: wrapperWithAlt(),
        }
      }, [className])

      const svgIcon = (
        <SvgIcon
          {...rest}
          role={role}
          stroke="currentColor"
          fill="currentColor"
          focusable={focusable}
          // size は react-icons のアイコンの大きさ、width / height は自前で SVG からアイコンを作る場合の大きさ指定
          // 親要素やデフォルトフォントサイズを継承するため1emで固定する
          size="1em"
          strokeWidth="0"
          width="1em"
          height="1em"
          color={replacedColor}
          className={classNames.icon}
          aria-hidden={actualAriaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
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
