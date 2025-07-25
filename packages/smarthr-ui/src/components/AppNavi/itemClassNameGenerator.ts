import { tv } from 'tailwind-variants'

export const itemClassNameGenerator = tv({
  slots: {
    wrapper: [
      'shr-box-border shr-inline-flex shr-cursor-pointer shr-items-center shr-gap-0.5 shr-whitespace-nowrap shr-px-0.5 shr-py-0.75 shr-text-base shr-font-bold shr-leading-none shr-text-grey shr-no-underline',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator--inner',
    ],
    icon: 'shr-fill-grey',
  },
  variants: {
    active: {
      true: {
        wrapper: [
          'shr-relative shr-text-black',
          'after:shr-absolute after:shr-bottom-0 after:shr-left-0 after:shr-right-0 after:shr-block after:shr-h-0.25 after:shr-bg-main after:shr-content-[""]',
        ],
        icon: 'shr-fill-black',
      },
    },
  },
})
