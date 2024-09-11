import { tv } from 'tailwind-variants'

export const dialogContentInner = tv({
  slots: {
    wrapper: 'shr-max-h-[calc(100dvh-theme(spacing.2))]',
    actionArea: [
      'smarthr-ui-Dialog-actionArea',
      'shr-border-t-shorthand shr-px-1.5 shr-py-1 shr-flex-[0_0_auto] shr-sticky shr-bottom-0 shr-z-1 shr-bg-white shr-rounded-b-m',
    ],
    buttonArea: ['smarthr-ui-Dialog-buttonArea', 'shr-ms-auto'],
    message: 'shr-text-right',
  },
})
