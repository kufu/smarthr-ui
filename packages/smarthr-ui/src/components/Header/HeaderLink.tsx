import { type ComponentProps, memo, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { AnchorButton } from '../Button'

type Props = Omit<
  ComponentProps<typeof AnchorButton>,
  'variant' | 'size' | 'wide' | 'loading' | 'inactiveReason'
> &
  VariantProps<typeof classNameGenerator>

const classNameGenerator = tv({
  base: [
    'shr-inline-flex shr-items-center',
    'shr-text-white',
    '[&&]:shr-px-0.25 [&&]:shr-font-normal',
    '[&&]:hover:shr-border-transparent [&&]:hover:shr-bg-transparent',
    '[&&]:focus-visible:shr-border-transparent [&&]:focus-visible:shr-bg-transparent',
    '[&_.smarthr-ui-Icon]:shr-block',
  ],
  variants: {
    enableNew: {
      true: ['[&&]:shr-px-0.5', 'shr-text-black'],
      false: 'hover:shr-text-white',
    },
  },
})

export const HeaderLink = memo<Props>(({ enableNew, className, ...rest }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ enableNew, className }),
    [enableNew, className],
  )

  return <AnchorButton {...rest} variant="text" target="_blank" className={actualClassName} />
})
