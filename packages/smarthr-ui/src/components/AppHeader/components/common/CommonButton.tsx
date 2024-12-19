import React, { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import { tv } from 'tailwind-variants'

export const commonButton = tv({
  base: [
    '[&&]:shr-flex [&&]:shr-items-center [&&]:shr-w-full [&&]:shr-px-1 [&&]:shr-py-0.5 [&&]:shr-box-border [&&]:shr-bg-transparent [&&]:shr-text-base [&&]:shr-text-black [&&]:shr-leading-normal [&&]:shr-no-underline [&&]:shr-rounded-m [&&]:shr-cursor-pointer [&&]:shr-border-none',
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

export const CommonButton: FC<Props> = ({
  elementAs,
  prefix,
  current,
  boldWhenCurrent,
  className,
  ...props
}) => {
  const commonButtonStyle = commonButton({
    prefix: Boolean(prefix),
    current,
    boldWhenCurrent,
    className,
  })

  if (elementAs === 'a') {
    return (
      <a {...(props as AnchorProps)} className={commonButtonStyle}>
        {prefix}
        {props.children}
      </a>
    )
  } else if (elementAs === 'button') {
    return (
      // eslint-disable-next-line smarthr/best-practice-for-button-element
      <button {...(props as ButtonProps)} className={commonButtonStyle}>
        {prefix}
        {props.children}
      </button>
    )
  } else {
    throw new Error(elementAs satisfies never)
  }
}
