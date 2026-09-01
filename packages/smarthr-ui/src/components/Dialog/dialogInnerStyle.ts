import { tv } from 'tailwind-variants'

export const dialogContentInner = tv({
  slots: {
    wrapper: 'shr-flex shr-max-h-[calc(100dvh-theme(spacing.2))] shr-flex-col',
    actionArea: [
      'smarthr-ui-Dialog-actionArea',
      'shr-border-t-shorthand shr-sticky shr-bottom-0 shr-z-1 shr-flex-none shr-rounded-b-m shr-bg-white shr-px-1.5 shr-py-1',
    ],
    actionAreaInner: '',
    buttonArea: ['smarthr-ui-Dialog-buttonArea', 'shr-ms-auto'],
    message: 'shr-text-right',
  },
  variants: {
    mobile: {
      true: {
        actionArea: 'shr-p-1',
      },
      false: {},
    },
    mobileType: {
      sheet: {
        wrapper: 'shr-max-h-[95svh]',
        actionArea: 'shr-rounded-none',
        actionAreaInner: 'shr-flex-col-reverse shr-flex-nowrap shr-items-stretch',
        buttonArea: 'shr-ms-0 shr-w-full shr-flex-nowrap [&>button]:shr-flex-1',
      },
    },
  },
})
