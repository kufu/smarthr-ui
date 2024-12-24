import React, { ComponentProps } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { TextLink } from '../TextLink'

type Props = Omit<ComponentProps<typeof TextLink>, 'suffix'> &
  VariantProps<typeof headerLink> & {
    textColor?:
      | 'inherit'
      | 'TEXT_BLACK'
      | 'TEXT_WHITE'
      | 'TEXT_GREY'
      | 'TEXT_DISABLED'
      | 'TEXT_LINK'
  }

const headerLink = tv({
  base: [
    'shr-inline-flex shr-items-center',
    'shr-px-0.25 shr-shadow-none',
    'focus-visible:shr-focus-indicator',
    '[&_.smarthr-ui-Icon]:shr-block',
  ],
  variants: {
    enableNew: {
      true: ['shr-px-0.5 shr-text-black', 'hover:shr-shadow-underline'],
      false: [],
    },
    textColor: {
      TEXT_WHITE: 'shr-text-white hover:shr-text-white',
      TEXT_BLACK: 'shr-text-black hover:shr-text-black',
      TEXT_GREY: 'shr-text-grey hover:shr-text-grey',
      TEXT_DISABLED: 'shr-text-disabled hover:shr-text-disabled',
      TEXT_LINK: 'shr-text-link hover:shr-text-link',
      inherit: 'shr-text-inherit hover:shr-text-inherit',
    },
  },
  compoundVariants: [
    {
      enableNew: false,
      textColor: undefined,
      className: 'shr-text-white hover:shr-text-white',
    },
  ],
})

export const HeaderLink: React.FC<Props> = ({ enableNew, className, textColor, ...props }) => {
  const style = headerLink({ enableNew, className, textColor })
  return <TextLink {...props} target="_blank" suffix={null} className={style} />
}
