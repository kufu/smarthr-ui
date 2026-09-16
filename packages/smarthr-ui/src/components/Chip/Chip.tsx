import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

type Props = PropsWithChildren<
  {
    disabled?: boolean
    color?: 'grey' | 'blue' | 'green' | 'orange' | 'red'
    size?: 'S'
  } & ComponentPropsWithoutRef<'span'>
>

const classNameGenerator = tv({
  base: [
    'smarthr-ui-Chip',
    'shr-border-shorthand shr-rounded-full shr-bg-white shr-leading-none shr-text-black',
    'contrast-more:shr-border-high-contrast',
    'data-[disabled]:shr-bg-white/50 data-[disabled]:shr-text-disabled',
  ],
  variants: {
    color: {
      grey: 'shr-border-grey-20',
      blue: 'shr-border-main',
      green: 'shr-border-green',
      orange: 'shr-border-orange',
      red: 'shr-border-danger',
    } satisfies Record<NonNullable<Props['color']>, string>,
    size: {
      S: 'shr-px-0.5 shr-py-0.25 shr-text-sm',
    } satisfies Record<NonNullable<Props['size']>, string>,
  },
})

export const Chip: FC<Props> = ({ size, color, disabled, className, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ size: size || 'S', color: color || 'grey', className }),
    [size, color, className],
  )

  return <span {...rest} className={actualClassName} data-disabled={disabled || undefined} />
}
