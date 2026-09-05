import { tv } from 'tailwind-variants'

const baseClassNameGenerator = tv({
  slots: {
    wrapper: [
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
      'data-[loading]:shr-flex-row-reverse',
    ],
    inner: [
      'smarthr-ui-Button-body',
      /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
      'shr-min-w-0',
    ],
  },
  variants: {
    variant: {
      primary: {
        wrapper: [
          'shr-border-main',
          'shr-bg-main',
          'shr-text-white',
          'focus-visible:shr-border-main-darken',
          'focus-visible:shr-bg-main-darken',
          'hover:shr-border-main-darken',
          'hover:shr-bg-main-darken',
        ],
      },
      secondary: {
        wrapper: [
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
      danger: {
        wrapper: [
          'shr-border-danger',
          'shr-bg-danger',
          'shr-text-white',
          'focus-visible:shr-border-danger-darken',
          'focus-visible:shr-bg-danger-darken',
          'hover:shr-border-danger-darken',
          'hover:shr-bg-danger-darken',
        ],
      },
      skeleton: {
        wrapper: [
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
      text: {
        wrapper: [
          'shr-border-transparent',
          'shr-bg-transparent',
          'shr-text-black',
          'focus-visible:shr-bg-white-darken',
          'hover:shr-bg-white-darken',
        ],
      },
      tertiary: {},
    },
    size: {
      M: {
        wrapper: [
          'shr-text-base',
          'shr-px-1',
          'shr-py-0.75',
          /* data-squareは子要素(inner span)に設定されるため:has()で検知する。
          上記px/pyより詳細度が高くshr-p-0.75相当に上書きされる */
          '[&:has([data-square])]:shr-p-0.75',
        ],
      },
      S: {
        wrapper: [
          'shr-p-0.5',
          'shr-text-sm',
          /* ボタンラベルの line-height を 0 にしたため、高さを担保する */
          'shr-min-h-[calc(theme(fontSize.sm)+theme(spacing.1)+theme(borderWidth.2))]',
        ],
        /* SVG とテキストコンテンツの縦位置を揃えるために指定 */
        inner: 'shr-leading-[0]',
      },
    },
    wide: {
      true: {
        wrapper: 'shr-w-full',
      },
    },
  },
})

export const buttonClassNameGenerator = tv({
  extend: baseClassNameGenerator,
  slots: {
    wrapper: [
      'smarthr-ui-Button',
      'aria-disabled:shr-cursor-not-allowed',
      /* alpha color を使用しているので、背景色と干渉させない */
      'aria-disabled:shr-bg-clip-padding',
      /* disabled ではなく aria-disabled で文字色が変わらないため、強制カラーモード時の色を指定 */
      'aria-disabled:forced-colors:shr-border-[GrayText] aria-disabled:forced-colors:shr-text-[GrayText]',
      '[&_.smarthr-ui-Icon]:forced-colors:aria-disabled:shr-fill-[GrayText]',
    ],
    loader: [
      'shr-align-bottom',
      '[&_.smarthr-ui-Loader-spinner]:shr-h-em [&_.smarthr-ui-Loader-spinner]:shr-w-em',
    ],
  },
  variants: {
    variant: {
      primary: {
        wrapper: [
          'aria-disabled:shr-border-main/50',
          'aria-disabled:shr-bg-main/50',
          'aria-disabled:shr-text-white/50',
        ],
        loader: [
          '[&_.smarthr-ui-Loader-line]:shr-border-white/50',
          '[&_.smarthr-ui-Loader-line]:forced-colors:shr-border-[ButtonBorder]',
        ],
      },
      secondary: {
        wrapper: [
          'aria-disabled:shr-border-disabled',
          'aria-disabled:shr-bg-white-darken',
          'aria-disabled:shr-text-disabled',
        ],
        loader: '[&_.smarthr-ui-Loader-line]:shr-border-disabled',
      },
      tertiary: {
        wrapper: [
          'shr-border-transparent',
          'shr-bg-transparent',
          'shr-text-link',
          'shr-font-normal',
          'focus-visible:shr-bg-white-darken',
          'hover:shr-bg-white-darken',
          'aria-disabled:shr-bg-transparent',
          'aria-disabled:shr-text-link/50',
        ],
        loader: '[&_.smarthr-ui-Loader-line]:shr-border-link/50',
      },
      danger: {
        wrapper: [
          'aria-disabled:shr-border-danger/50',
          'aria-disabled:shr-bg-danger/50',
          'aria-disabled:shr-text-white/50',
        ],
        loader: [
          '[&_.smarthr-ui-Loader-line]:shr-border-white/50',
          '[&_.smarthr-ui-Loader-line]:forced-colors:shr-border-[ButtonBorder]',
        ],
      },
      skeleton: {
        wrapper: [
          'aria-disabled:shr-border-white/50',
          'aria-disabled:shr-bg-transparent',
          'aria-disabled:shr-text-white/50',
        ],
        loader: [
          '[&_.smarthr-ui-Loader-line]:shr-border-white/50',
          '[&_.smarthr-ui-Loader-line]:forced-colors:shr-border-[ButtonBorder]',
        ],
      },
      text: {
        wrapper: [
          'aria-disabled:shr-border-transparent',
          'aria-disabled:shr-bg-transparent',
          'aria-disabled:shr-text-disabled',
        ],
        loader: '[&_.smarthr-ui-Loader-line]:shr-border-disabled',
      },
    },
  },
})

export const anchorClassNameGenerator = tv({
  extend: baseClassNameGenerator,
  slots: {
    wrapper: [
      'smarthr-ui-AnchorButton',
      'shr-no-underline',
      '[&:not([href])]:shr-cursor-not-allowed',
      /* alpha color を使用しているので、背景色と干渉させない */
      '[&:not([href])]:shr-bg-clip-padding',
      '[&_.smarthr-ui-Icon]:forced-colors:shr-fill-[LinkText]',
      '[&:not([href])_.smarthr-ui-Icon]:forced-colors:shr-fill-[CanvasText]',
    ],
  },
  variants: {
    variant: {
      primary: {
        wrapper: [
          '[&:not([href])]:shr-border-main/50',
          '[&:not([href])]:shr-bg-main/50',
          '[&:not([href])]:shr-text-white/50',
        ],
      },
      secondary: {
        wrapper: [
          '[&:not([href])]:shr-border-disabled',
          '[&:not([href])]:shr-bg-white-darken',
          '[&:not([href])]:shr-text-disabled',
        ],
      },
      danger: {
        wrapper: [
          '[&:not([href])]:shr-border-danger/50',
          '[&:not([href])]:shr-bg-danger/50',
          '[&:not([href])]:shr-text-white/50',
        ],
      },
      skeleton: {
        wrapper: [
          '[&:not([href])]:shr-border-white/50',
          '[&:not([href])]:shr-bg-transparent',
          '[&:not([href])]:shr-text-white/50',
        ],
      },
      text: {
        wrapper: [
          '[&:not([href])]:shr-border-transparent',
          '[&:not([href])]:shr-bg-transparent',
          '[&:not([href])]:shr-text-disabled',
        ],
      },
    },
  },
})
