import React, { ComponentProps } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { TextLink } from '../TextLink'

type Props = ComponentProps<typeof TextLink> & VariantProps<typeof headerLink>

const headerLink = tv({
  base: [
    'shr-px-0.25 shr-text-white shr-shadow-none',
    'hover:shr-text-white',
    'focus-visible:shr-focus-indicator',
    '[.smarthr-ui-Header-enable-new_&]:shr-text-black',
  ],
  variants: {
    enableNew: {
      true: ['shr-px-0.5', 'hover:shr-shadow-underline'],
    },
  },
})

export const HeaderLink: React.FC<Props> = ({ enableNew, className, ...props }) => {
  const style = headerLink({ enableNew, className })
  return <TextLink {...props} target="_blank" suffix={null} className={style} />
}
