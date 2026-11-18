import { tv } from 'tailwind-variants'

import type { Props } from '../types'

export const FILE_NAME_BUTTON_CLASSNAME =
  'smarthr-ui-InputFile-fileName shr-justify-start shr-min-w-0 shr-break-all shr-whitespace-normal shr-text-left'
export const PREVIEW_BUTTON_CLASSNAME = `${FILE_NAME_BUTTON_CLASSNAME} shr-p-0 shr-font-normal shr-text-link`

export const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-InputFile',
    fileList: ['smarthr-ui-InputFile-fileList', 'shr-list-none shr-self-stretch shr-text-base'],
    fileItem: 'shr-flex shr-items-center',
    inputWrapper: [
      'shr-border-shorthand shr-relative shr-inline-flex shr-rounded-m shr-font-bold shr-leading-none',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
      '[&&&]:has-[[aria-invalid]]:shr-border-danger',
    ],
    input: [
      'smarthr-ui-InputFile-input',
      'shr-absolute shr-left-0 shr-top-0 shr-h-full shr-w-full shr-opacity-0',
      'file:shr-h-full file:shr-w-full file:shr-cursor-pointer',
      'file:disabled:shr-cursor-not-allowed',
    ],
    prefix: 'shr-me-0.5 shr-inline-flex',
  },
  variants: {
    /* Buttonのvariantと同じ見た目にする。
    inputはwrapper内に不可視で重ねているため、disabledは has-[:disabled] で表現する。
    has-[:disabled] だけでは hover の指定に負けるため、hover で変化させるプロパティは has-[:disabled]:hover で打ち消す */
    variant: {
      secondary: {
        inputWrapper: [
          'shr-bg-white',
          'hover:shr-border-darken hover:shr-bg-white-darken hover:shr-text-black',
          'has-[:disabled]:shr-border-disabled has-[:disabled]:shr-bg-white-darken has-[:disabled]:shr-text-disabled',
          'has-[:disabled]:hover:shr-border-disabled has-[:disabled]:hover:shr-text-disabled',
        ],
      },
      tertiary: {
        inputWrapper: [
          'shr-border-transparent shr-bg-transparent shr-font-normal shr-text-link',
          'hover:shr-bg-white-darken',
          'has-[:disabled]:shr-bg-transparent has-[:disabled]:shr-text-link/50',
          'has-[:disabled]:hover:shr-bg-transparent',
        ],
      },
      skeleton: {
        inputWrapper: [
          'shr-border-white shr-bg-transparent shr-text-white',
          'hover:shr-border-white-darken hover:shr-bg-overlay hover:shr-text-white-darken',
          'has-[:disabled]:shr-border-white/50 has-[:disabled]:shr-bg-transparent has-[:disabled]:shr-text-white/50',
          'has-[:disabled]:hover:shr-border-white/50 has-[:disabled]:hover:shr-bg-transparent has-[:disabled]:hover:shr-text-white/50',
        ],
      },
      text: {
        inputWrapper: [
          'shr-border-transparent shr-bg-transparent shr-text-black',
          'hover:shr-bg-white-darken',
          'has-[:disabled]:shr-bg-transparent has-[:disabled]:shr-text-disabled',
          'has-[:disabled]:hover:shr-bg-transparent',
        ],
      },
    } satisfies Record<NonNullable<Props['variant']>, { inputWrapper: string[] }>,
    size: {
      M: {
        inputWrapper: 'shr-px-1 shr-py-0.75 shr-text-base',
      },
      S: {
        inputWrapper: 'shr-p-0.5 shr-text-sm',
      },
    } satisfies Record<NonNullable<Props['size']>, { inputWrapper: string }>,
  },
  defaultVariants: {
    variant: 'secondary',
    size: 'M',
  },
})
