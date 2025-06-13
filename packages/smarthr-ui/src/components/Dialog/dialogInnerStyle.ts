import { tv } from 'tailwind-variants'

export const dialogContentInner = tv({
  slots: {
    wrapper: 'shr-flex shr-max-h-[calc(100dvh-theme(spacing.2))] shr-flex-col',
    actionArea: [
      'smarthr-ui-Dialog-actionArea',
      'shr-border-t-shorthand shr-sticky shr-bottom-0 shr-z-1 shr-flex-[0_0_auto] shr-rounded-b-m shr-bg-white shr-px-1.5 shr-py-1',
    ],
    buttonArea: ['smarthr-ui-Dialog-buttonArea', 'shr-ms-auto'],
    message: 'shr-text-right',
  },
})
