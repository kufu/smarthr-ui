import { tv } from '../../../libs/tv'

const classNameGenerator = tv({
  base: [
    'shr-rte-inline-flex shr-rte-items-center shr-rte-justify-center shr-rte-gap-0.25',
    'shr-rte-cursor-pointer shr-rte-border-none shr-rte-bg-transparent shr-rte-px-0.5 shr-rte-py-0.25 shr-rte-text-sm shr-rte-text-black',
    'hover:shr-rte-bg-white-darken',
    'focus-visible:shr-rte-focus-indicator',
  ],
})

// eslint-disable-next-line smarthr/best-practice-for-tailwind-variants -- module scopeで定義されており十分にmemo化されている。誤検知
export const MEDIA_TOOLBAR_BUTTON_CLASS_NAME = classNameGenerator()
