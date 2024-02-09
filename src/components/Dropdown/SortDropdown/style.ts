import { tv } from 'tailwind-variants'

export const sortDropdownStyle = tv({
  slots: {
    trigger: 'shr-font-normal',
    body: 'shr-p-1.5',
    select: 'shr-min-w-[16em]',
    footer: 'shr-border-t shr-border-solid shr-border-default shr-px-1.5 shr-py-1',
  },
})
