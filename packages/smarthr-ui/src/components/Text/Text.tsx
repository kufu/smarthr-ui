import {
  type ComponentProps,
  type ElementType,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'

import type { AbstractSize, CharRelativeSize } from '../../themes/createSpacing'
import type { Gap } from '../../types'

type StyleType =
  | 'screenTitle'
  | 'sectionTitle'
  | 'blockTitle'
  | 'subBlockTitle'
  | 'subSubBlockTitle'

export const STYLE_TYPE_MAP: { [key in StyleType]: VariantProps<typeof classNameGenerator> } = {
  screenTitle: {
    size: 'XL',
    leading: 'TIGHT',
    weight: 'normal',
  },
  sectionTitle: {
    size: 'L',
    leading: 'TIGHT',
    weight: 'normal',
  },
  blockTitle: {
    size: 'M',
    leading: 'TIGHT',
    weight: 'bold',
  },
  subBlockTitle: {
    size: 'M',
    leading: 'TIGHT',
    weight: 'bold',
    color: 'TEXT_GREY',
  },
  subSubBlockTitle: {
    size: 'S',
    leading: 'TIGHT',
    weight: 'bold',
    color: 'TEXT_GREY',
  },
}
const UNDEFINED_STYLE_VALUES = {
  size: undefined,
  leading: undefined,
  weight: undefined,
  color: undefined,
}

const classNameGenerator = tv({
  variants: {
    size: {
      XXS: 'shr-text-2xs',
      XS: 'shr-text-xs',
      S: 'shr-text-sm',
      M: 'shr-text-base',
      L: 'shr-text-lg',
      XL: 'shr-text-xl',
      XXL: 'shr-text-2xl',
    },
    weight: {
      normal: 'shr-font-normal',
      bold: 'shr-font-bold',
    },
    italic: {
      true: 'shr-italic',
    },
    color: {
      TEXT_BLACK: 'shr-text-black',
      TEXT_WHITE: 'shr-text-white',
      TEXT_GREY: 'shr-text-grey',
      TEXT_DISABLED: 'shr-text-disabled',
      TEXT_LINK: 'shr-text-link',
      inherit: 'shr-text-color-inherit',
    },
    leading: {
      NONE: 'shr-leading-none',
      TIGHT: 'shr-leading-tight',
      NORMAL: 'shr-leading-normal',
      LOOSE: 'shr-leading-loose',
    },
    whiteSpace: {
      normal: 'shr-whitespace-normal',
      nowrap: 'shr-whitespace-nowrap',
      pre: 'shr-whitespace-pre',
      'pre-line': 'shr-whitespace-pre-line',
      'pre-wrap': 'shr-whitespace-pre-wrap',
    },
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

type ActualIconType =
  | undefined
  | {
      /** テキスト左に設置するアイコン */
      prefix?: ReactNode
      /** テキスト右に設置するアイコン */
      suffix?: ReactNode
      /** アイコンと並べるテキストとの溝 */
      gap?: CharRelativeSize | AbstractSize
    }
type IconType = ActualIconType | ReactNode

// VariantProps を使うとコメントが書けない〜🥹
export type TextProps<T extends ElementType = 'span'> = VariantProps<typeof classNameGenerator> & {
  /** テキストコンポーネントの HTML タグ名。初期値は span */
  as?: T
  /** 強調するかどうかの真偽値。指定すると em 要素になる */
  emphasis?: boolean
  /** 見た目の種類 */
  styleType?: StyleType
  /** 設置するアイコン */
  icon?: IconType
}

const iconObjectConverter = (icon: ReactNode) => (icon ? { prefix: icon } : undefined)

const ActualText = <T extends ElementType = 'span'>({
  emphasis,
  styleType,
  icon: orgIcon,
  weight = emphasis ? 'bold' : undefined,
  as: Component = emphasis ? 'em' : 'span',
  size,
  italic,
  color,
  leading,
  whiteSpace,
  className,
  children,
  ...rest
}: PropsWithChildren<TextProps<T> & ComponentProps<T>>) => {
  const icon = useObjectAttributes<IconType, ActualIconType>(orgIcon, iconObjectConverter)
  const actualClassName = useMemo(() => {
    const styleTypeValues = styleType
      ? STYLE_TYPE_MAP[styleType as StyleType]
      : UNDEFINED_STYLE_VALUES

    return classNameGenerator({
      size: size || styleTypeValues.size,
      weight: weight || styleTypeValues.weight,
      color: color || styleTypeValues.color,
      leading: leading || styleTypeValues.leading,
      italic,
      whiteSpace,
      className,
    })
  }, [size, weight, italic, color, leading, whiteSpace, className, styleType])
  const wrapperClassName = useMemo(
    () => (icon ? wrapperClassNameGenerator({ gap: icon.gap || 0.25 }) : ''),
    [icon],
  )

  return (
    <Component {...rest} className={actualClassName}>
      {icon ? (
        <span className={wrapperClassName}>
          {icon.prefix}
          {children}
          {icon.suffix}
        </span>
      ) : (
        children
      )}
    </Component>
  )
}

export const Text = memo(ActualText) as typeof ActualText
