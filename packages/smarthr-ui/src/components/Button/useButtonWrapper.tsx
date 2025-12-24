import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ElementType,
  type ForwardedRef,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { Loader } from '../Loader'

import type { Variant } from './types'

// HINT: prefix, suffixが存在せず、かつicon,svg,imgのいずれかが単一でbodyに含まれるButtonのselector
// HINT: smarthr-ui-Icon-extendedはアイコン+α(例えば複数のアイコンをまとめて一つにしているなど)を表すclass
const ICON_BUTTON_SELECTOR = ['.smarthr-ui-Icon', '.smarthr-ui-Icon-extended', 'svg', 'img'].reduce(
  (prev, selector, index) =>
    `${prev}${index !== 0 ? ',' : ''}.smarthr-ui-Button-body:only-child>${selector}:only-child`,
  '',
)

type AbstractProps = PropsWithChildren<{
  size: 'default' | 's'
  wide: boolean
  variant: Variant
  $loading?: boolean
  className: string
  elementAs?: ElementType
  prefix?: ReactNode
  suffix?: ReactNode
}>

type AbstractButtonProps = AbstractProps & {
  isAnchor?: never
  buttonRef?: ForwardedRef<HTMLButtonElement>
}
type ButtonProps = AbstractButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof AbstractButtonProps>

type AbstractAnchorProps = AbstractProps & {
  isAnchor: true
  anchorRef?: ForwardedRef<HTMLAnchorElement>
}
type AnchorProps = AbstractAnchorProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof AbstractAnchorProps>

export type Props = ButtonProps | AnchorProps

// HINT: useButtonWrapperの引数を調整する場合、以下も調整する
type FilteredProps =
  | 'size'
  | 'wide'
  | 'variant'
  | 'className'
  | 'prefix'
  | 'suffix'
  | 'children'
  | 'isAnchor'
export type FilteredButtonProps = Omit<ButtonProps, FilteredProps>
export type FilteredAnchorProps = Omit<AnchorProps, FilteredProps>

export const useButtonWrapper = ({
  size,
  wide = false,
  variant,
  $loading,
  className,
  prefix,
  suffix,
  children,
  isAnchor,
  ...rest
}: Props) => {
  const innerRef = useRef<HTMLElement>(null)
  // HINT: squareは
  //  null: Buttonのレンダリング前
  //  boolean: レンダリング後
  const [square, setSquare] = useState<null | boolean>(null)

  const classNames = useMemo(() => {
    const { button, anchor, loader } = wrapperClassNameGenerator({
      variant,
      size,
      square: !!square,
      loading: !!$loading,
      wide,
    })

    const wrapper = isAnchor ? anchor : button

    return {
      wrapper: wrapper({ className }),
      loader: loader(),
    }
  }, [$loading, size, square, variant, wide, className, isAnchor])

  const innerClassName = useMemo(() => innerClassNameGenerator({ size }), [size])

  let actualPrefix = prefix
  let actualSuffix = suffix
  let actualChildren = children

  if ($loading) {
    actualPrefix = undefined
    const loader = <Loader size="s" className={classNames.loader} role="presentation" />

    // HINT: squareは null | boolean のため、switchで判定する
    // nullの場合にactualSuffixにloaderを突っ込んでしまうとsquareの計算が狂ってしまう
    switch (square) {
      case true:
        actualChildren = loader
        break
      case false:
        actualSuffix = loader
        break
    }
  }

  useEffect(() => {
    if (innerRef.current) {
      // HINT: prefix, suffixが存在せず、かつicon,svg,imgのいずれかが単一でbodyに含まれるButtonの場合true
      setSquare(!!innerRef.current.querySelector(ICON_BUTTON_SELECTOR))
    }
  }, [children])

  return {
    filteredProps: { ...rest, $loading } as FilteredAnchorProps | FilteredButtonProps,
    classNames,
    children: (
      <>
        {actualPrefix}
        <span ref={innerRef} className={innerClassName}>
          {actualChildren}
        </span>
        {actualSuffix}
      </>
    ),
  }
}

const wrapperClassNameGenerator = tv({
  slots: {
    button: [
      'aria-disabled:shr-cursor-not-allowed',
      /* alpha color を使用しているので、背景色と干渉させない */
      'aria-disabled:shr-bg-clip-padding',
      /* disabled ではなく aria-disabled で文字色が変わらないため、強制カラーモード時の色を指定 */
      'aria-disabled:forced-colors:shr-border-[GrayText] aria-disabled:forced-colors:shr-text-[GrayText]',
      '[&_.smarthr-ui-Icon]:forced-colors:aria-disabled:shr-fill-[GrayText]',
    ],
    anchor: [
      'shr-no-underline',
      '[&:not([href])]:shr-cursor-not-allowed',
      /* alpha color を使用しているので、背景色と干渉させない */
      '[&:not([href])]:shr-bg-clip-padding',
      '[&_.smarthr-ui-Icon]:forced-colors:shr-fill-[LinkText]',
      '[&:not([href])_.smarthr-ui-Icon]:forced-colors:shr-fill-[CanvasText]',
    ],
    loader: [
      'shr-align-bottom',
      '[&_.smarthr-ui-Loader-spinner]:shr-h-em [&_.smarthr-ui-Loader-spinner]:shr-w-em',
    ],
  },
  variants: {
    variant: {
      primary: {},
      secondary: {},
      danger: {},
      skeleton: {},
      text: {},
      tertiary: {},
    },
    size: {
      default: {},
      s: {},
    },
    square: {
      true: {},
    },
    loading: {
      true: {},
    },
    wide: {
      true: {},
    },
  },
  compoundSlots: [
    {
      slots: ['button', 'anchor'],
      className: [
        'shr-box-border',
        'shr-cursor-pointer',
        'shr-inline-flex',
        'shr-justify-center',
        'shr-items-center',
        'shr-gap-0.5',
        'shr-text-center',
        'shr-whitespace-nowrap',
        'shr-rounded-m',
        /* ボタンの高さを合わせるために指定 */
        'shr-border-shorthand',
        'shr-font-inherit',
        'shr-font-bold',
        'shr-leading-none',
        'focus-visible:shr-focus-indicator',
        'contrast-more:shr-border-high-contrast',
        /* baseline より下の leading などの余白を埋める */
        '[&_.smarthr-ui-Icon]:shr-block',
        /** selector list は使えない
         * via https://github.com/tailwindlabs/tailwindcss/issues/10576#issuecomment-1440703413
         */
        '[&_svg]:shr-block',
      ],
    },
    {
      slots: ['button', 'anchor'],
      size: 's',
      className: [
        'shr-p-0.5',
        'shr-text-sm',
        /* ボタンラベルの line-height を 0 にしたため、高さを担保する */
        'shr-min-h-[calc(theme(fontSize.sm)+theme(spacing.1)+theme(borderWidth.2))]',
      ],
    },
    {
      slots: ['button', 'anchor'],
      size: 'default',
      className: ['shr-text-base'],
    },
    {
      slots: ['button', 'anchor'],
      size: 'default',
      square: false,
      className: 'shr-px-1 shr-py-0.75',
    },
    {
      slots: ['button', 'anchor'],
      size: 'default',
      square: true,
      className: 'shr-p-0.75',
    },
    {
      slots: ['button', 'anchor'],
      loading: true,
      className: 'shr-flex-row-reverse',
    },
    {
      slots: ['button', 'anchor'],
      wide: true,
      className: 'shr-w-full',
    },
    {
      slots: ['button', 'anchor'],
      variant: 'primary',
      className: [
        'shr-border-main',
        'shr-bg-main',
        'shr-text-white',
        'focus-visible:shr-border-main-darken',
        'focus-visible:shr-bg-main-darken',
        'hover:shr-border-main-darken',
        'hover:shr-bg-main-darken',
      ],
    },
    {
      slots: ['button'],
      variant: 'primary',
      className: [
        'aria-disabled:shr-border-main/50',
        'aria-disabled:shr-bg-main/50',
        'aria-disabled:shr-text-white/50',
      ],
    },
    {
      slots: ['anchor'],
      variant: 'primary',
      className: [
        '[&:not([href])]:shr-border-main/50',
        '[&:not([href])]:shr-bg-main/50',
        '[&:not([href])]:shr-text-white/50',
      ],
    },
    {
      slots: ['button', 'anchor'],
      variant: 'secondary',
      className: [
        'shr-border-default',
        'shr-bg-white',
        'shr-text-black',
        'focus-visible:shr-border-darken',
        'focus-visible:shr-bg-white-darken',
        'focus-visible:contrast-more:shr-border-high-contrast',
        'hover:shr-border-darken',
        'hover:shr-bg-white-darken',
        'hover:contrast-more:shr-border-high-contrast',
      ],
    },
    {
      slots: ['button'],
      variant: 'secondary',
      className: [
        'aria-disabled:shr-border-disabled',
        'aria-disabled:shr-bg-white-darken',
        'aria-disabled:shr-text-disabled',
      ],
    },
    {
      slots: ['anchor'],
      variant: 'secondary',
      className: [
        '[&:not([href])]:shr-border-disabled',
        '[&:not([href])]:shr-bg-white-darken',
        '[&:not([href])]:shr-text-disabled',
      ],
    },
    {
      slots: ['button'],
      variant: 'tertiary',
      className: [
        'shr-border-transparent',
        'shr-bg-transparent',
        'shr-text-link',
        'shr-font-normal',
        'focus-visible:shr-bg-white-darken',
        'hover:shr-bg-white-darken',
        'aria-disabled:shr-bg-transparent',
        'aria-disabled:shr-text-link/50',
      ],
    },
    {
      slots: ['button', 'anchor'],
      variant: 'danger',
      className: [
        'shr-border-danger',
        'shr-bg-danger',
        'shr-text-white',
        'focus-visible:shr-border-danger-darken',
        'focus-visible:shr-bg-danger-darken',
        'hover:shr-border-danger-darken',
        'hover:shr-bg-danger-darken',
      ],
    },
    {
      slots: ['button'],
      variant: 'danger',
      className: [
        'aria-disabled:shr-border-danger/50',
        'aria-disabled:shr-bg-danger/50',
        'aria-disabled:shr-text-white/50',
      ],
    },
    {
      slots: ['anchor'],
      variant: 'danger',
      className: [
        '[&:not([href])]:shr-border-danger/50',
        '[&:not([href])]:shr-bg-danger/50',
        '[&:not([href])]:shr-text-white/50',
      ],
    },
    {
      slots: ['button', 'anchor'],
      variant: 'skeleton',
      className: [
        'shr-border-white',
        'shr-bg-transparent',
        'shr-text-white',
        'focus-visible:shr-border-white-darken',
        'focus-visible:shr-bg-overlay',
        'focus-visible:shr-text-white-darken',
        'hover:shr-border-white-darken',
        'hover:shr-bg-overlay',
        'hover:shr-text-white-darken',
      ],
    },
    {
      slots: ['button'],
      variant: 'skeleton',
      className: [
        'aria-disabled:shr-border-white/50',
        'aria-disabled:shr-bg-transparent',
        'aria-disabled:shr-text-white/50',
      ],
    },
    {
      slots: ['anchor'],
      variant: 'skeleton',
      className: [
        '[&:not([href])]:shr-border-white/50',
        '[&:not([href])]:shr-bg-transparent',
        '[&:not([href])]:shr-text-white/50',
      ],
    },
    {
      slots: ['button', 'anchor'],
      variant: 'text',
      className: [
        'shr-border-transparent',
        'shr-bg-transparent',
        'shr-text-black',
        'focus-visible:shr-bg-white-darken',
        'hover:shr-bg-white-darken',
      ],
    },
    {
      slots: ['button'],
      variant: 'text',
      className: [
        'aria-disabled:shr-border-transparent',
        'aria-disabled:shr-bg-transparent',
        'aria-disabled:shr-text-disabled',
      ],
    },
    {
      slots: ['anchor'],
      variant: 'text',
      className: [
        '[&:not([href])]:shr-border-transparent',
        '[&:not([href])]:shr-bg-transparent',
        '[&:not([href])]:shr-text-disabled',
      ],
    },
    {
      slots: ['loader'],
      variant: ['primary', 'danger', 'skeleton'],
      className: [
        '[&_.smarthr-ui-Loader-line]:shr-border-white/50',
        '[&_.smarthr-ui-Loader-line]:forced-colors:shr-border-[ButtonBorder]',
      ],
    },
    {
      slots: ['loader'],
      variant: ['secondary', 'text'],
      className: '[&_.smarthr-ui-Loader-line]:shr-border-disabled',
    },
    {
      slots: ['loader'],
      variant: 'tertiary',
      className: '[&_.smarthr-ui-Loader-line]:shr-border-link/50',
    },
  ],
})

const innerClassNameGenerator = tv({
  base: [
    'smarthr-ui-Button-body',
    /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
    'shr-min-w-0',
  ],
  variants: {
    size: {
      default: '',
      s: [
        /* SVG とテキストコンテンツの縦位置を揃えるために指定 */
        'shr-leading-[0]',
      ],
    },
  },
})
