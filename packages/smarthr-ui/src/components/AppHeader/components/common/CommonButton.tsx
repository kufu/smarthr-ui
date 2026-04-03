import { tv } from 'tailwind-variants'

// Shared className generator for AppHeader button styling
// Used to maintain consistent styling across dropdown menus and navigation items
export const commonButtonClassNameGenerator = tv({
  base: [
    '[&&]:shr-box-border [&&]:shr-flex [&&]:shr-w-full [&&]:shr-cursor-pointer [&&]:shr-items-center [&&]:shr-border-none [&&]:shr-bg-transparent [&&]:shr-px-1 [&&]:shr-py-0.5 [&&]:shr-text-base [&&]:shr-leading-normal [&&]:shr-text-black [&&]:shr-no-underline',
    '[&&]:hover:shr-bg-white-darken',
    '[&&]:focus-visible:shr-focus-indicator [&&]:focus-visible:shr-bg-white-darken',
  ],
  variants: {
    prefix: {
      true: ['[&&]:shr-gap-0.5'],
    },
    current: {
      true: ['[&&]:shr-bg-white-darken'],
    },
    boldWhenCurrent: {
      true: null,
      false: ['[&&]:shr-font-normal'],
    },
    rounded: {
      true: ['[&&]:shr-rounded-m'],
      false: ['[&&]:shr-rounded-none'],
    },
  },
  compoundVariants: [
    {
      boldWhenCurrent: true,
      current: true,
      className: ['[&&]:shr-font-bold'],
    },
  ],
  defaultVariants: {
    rounded: true,
  },
})
