import React, { ComponentProps } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { TextLink } from '../TextLink'

type Props = Omit<ComponentProps<typeof TextLink>, 'suffix'> & VariantProps<typeof headerLink>

const headerLink = tv({
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

export const HeaderLink: React.FC<Props> = ({ enableNew, className, ...props }) => {
  const style = headerLink({ enableNew, className })
  return <TextLink {...props} target="_blank" suffix={null} className={style} />
}
