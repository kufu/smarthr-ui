import { tv } from 'tailwind-variants'

export const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-InputFile shr-block',
    fileList: ['smarthr-ui-InputFile-fileList', 'shr-list-none shr-self-stretch shr-text-base'],
    fileItem: 'shr-flex shr-items-center',
    inputWrapper: [
      'shr-border-shorthand shr-relative shr-inline-flex shr-rounded-m shr-bg-white shr-font-bold shr-leading-none',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
      'has-[[aria-invalid]]:shr-border-danger',
      'hover:shr-border-darken hover:shr-bg-white-darken hover:shr-text-black',
      'has-[:disabled]:shr-border-disabled has-[:disabled]:shr-bg-white-darken has-[:disabled]:shr-text-disabled',
      'has-[:disabled]:hover:shr-border-disabled has-[:disabled]:hover:shr-text-disabled',
      'has-[[aria-disabled="true"]]:shr-border-disabled has-[[aria-disabled="true"]]:shr-bg-white-darken has-[[aria-disabled="true"]]:shr-text-disabled',
      'has-[[aria-disabled="true"]]:hover:shr-border-disabled has-[[aria-disabled="true"]]:hover:shr-text-disabled',
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
    size: {
      M: {
        inputWrapper: 'shr-px-1 shr-py-0.75 shr-text-base',
      },
      S: {
        inputWrapper: 'shr-p-0.5 shr-text-sm',
      },
    },
  },
  defaultVariants: {
    size: 'M',
  },
})
