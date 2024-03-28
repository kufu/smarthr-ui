import { tv } from 'tailwind-variants'

export const sortDropdownStyle = tv({
  slots: {
    body: 'shr-p-1.5',
    select: 'shr-min-w-[16em]',
    footer: 'shr-border-t-shorthand shr-px-1.5 shr-py-1',
  },
})
