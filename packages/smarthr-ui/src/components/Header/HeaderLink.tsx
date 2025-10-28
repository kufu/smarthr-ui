import { type ComponentProps, memo, useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { TextLink } from '../TextLink'

type Props = Omit<ComponentProps<typeof TextLink>, 'suffix'> &
  VariantProps<typeof classNameGenerator>

const classNameGenerator = tv({
  base: [
    'shr-inline-flex shr-items-center',
    'shr-px-0.25 shr-text-white shr-shadow-none',
    'focus-visible:shr-focus-indicator',
    '[&_.smarthr-ui-Icon]:shr-block',
  ],
  variants: {
    enableNew: {
      true: ['shr-px-0.5 shr-text-black', 'hover:shr-shadow-underline'],
      false: 'hover:shr-text-white',
    },
  },
})

export const HeaderLink = memo<Props>(({ enableNew, className, ...props }) => {
  const actualClassName = useMemo(
    () => classNameGenerator({ enableNew, className }),
    [enableNew, className],
  )

  return <TextLink {...props} target="_blank" className={actualClassName} />
})
