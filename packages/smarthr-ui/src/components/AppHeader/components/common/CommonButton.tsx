import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { AnchorButton, Button } from '../../../Button'

// HINT: Button[variant=text] をメニューの項目として使うための上書き
export const commonButtonClassNameGenerator = tv({
  base: [
    'shr-flex shr-justify-start shr-whitespace-normal shr-border-none shr-py-0.5 shr-text-left shr-font-normal shr-leading-normal',
  ],
  variants: {
    current: {
      true: ['shr-bg-white-darken'],
    },
    boldWhenCurrent: {
      true: null,
    },
  },
  compoundVariants: [
    {
      boldWhenCurrent: true,
      current: true,
      className: ['shr-font-bold'],
    },
  ],
})

type AnchorProps = Omit<ComponentPropsWithoutRef<'a'>, 'prefix' | 'onClick'> & {
  handleClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}
type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'prefix' | 'onClick'> & {
  handleClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

type Props = (({ elementAs: 'a' } & AnchorProps) | ({ elementAs: 'button' } & ButtonProps)) & {
  prefix?: ReactNode
  suffix?: ReactNode
  current?: boolean
  boldWhenCurrent?: boolean
}

export const CommonButton = memo<Props>(
  ({ elementAs, current, boldWhenCurrent, className, handleClick, ...rest }) => {
    const actualClassName = useMemo(
      () => commonButtonClassNameGenerator({ current, boldWhenCurrent, className }),
      [current, boldWhenCurrent, className],
    )

    switch (elementAs) {
      case 'a':
        return (
          <AnchorButton
            {...(rest as AnchorProps)}
            variant="text"
            wide
            className={actualClassName}
            onClick={handleClick as AnchorProps['handleClick']}
          />
        )
      case 'button':
        return (
          <Button
            {...(rest as ButtonProps)}
            variant="text"
            wide
            className={actualClassName}
            onClick={handleClick as ButtonProps['handleClick']}
          />
        )
    }

    throw new Error(elementAs satisfies never)
  },
)
