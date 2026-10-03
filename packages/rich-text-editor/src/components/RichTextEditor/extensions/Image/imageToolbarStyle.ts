import { tv } from '../../../../libs/tv'

const classNameGenerator = tv({
  base: [
    'shr-inline-flex shr-items-center shr-justify-center shr-gap-0.25',
    'shr-cursor-pointer shr-border-none shr-bg-transparent shr-px-0.5 shr-py-0.25 shr-text-sm shr-text-black',
    'hover:shr-bg-white-darken',
    'focus-visible:shr-focus-indicator',
  ],
})

export const IMAGE_TOOLBAR_BUTTON_CLASS_NAME = classNameGenerator()
