import { type ComponentPropsWithoutRef, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

export const commonButtonClassNameGenerator = tv({
  base: [
    '[&&]:shr-box-border [&&]:shr-flex [&&]:shr-w-full [&&]:shr-cursor-pointer [&&]:shr-items-center [&&]:shr-rounded-m [&&]:shr-border-none [&&]:shr-bg-transparent [&&]:shr-px-1 [&&]:shr-py-0.5 [&&]:shr-text-base [&&]:shr-leading-normal [&&]:shr-text-black [&&]:shr-no-underline',
    '[&&]:hover:shr-bg-white-darken',
    '[&&]:focus-visible:shr-bg-white-darken',
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
  },
  compoundVariants: [
    {
      boldWhenCurrent: true,
      current: true,
      className: ['[&&]:shr-font-bold'],
    },
  ],
})

type AnchorProps = Omit<ComponentPropsWithoutRef<'a'>, 'prefix'>
type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'prefix'>

type Props = (({ elementAs: 'a' } & AnchorProps) | ({ elementAs: 'button' } & ButtonProps)) & {
  prefix?: ReactNode
  current?: boolean
  boldWhenCurrent?: boolean
}

export const CommonButton = memo<Props>(
  ({ elementAs, prefix, current, boldWhenCurrent, className, ...rest }) => {
    const actualClassName = useMemo(
      () =>
        commonButtonClassNameGenerator({
          prefix: !!prefix,
          current,
          boldWhenCurrent,
          className,
        }),
      [current, prefix, boldWhenCurrent, className],
    )

    switch (elementAs) {
      case 'a':
        return (
          <a {...(rest as AnchorProps)} className={actualClassName}>
            {prefix}
            {rest.children}
          </a>
        )
      case 'button':
        return (
          // eslint-disable-next-line smarthr/best-practice-for-button-element
          <button {...(rest as ButtonProps)} className={actualClassName}>
            {prefix}
            {rest.children}
          </button>
        )
    }

    throw new Error(elementAs satisfies never)
  },
)
