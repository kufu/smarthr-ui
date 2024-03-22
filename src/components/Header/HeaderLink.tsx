import React, { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'

import { TextLink } from '../TextLink'

type Props = ComponentProps<typeof TextLink>

const headerLink = tv({
  base: [
    'shr-px-0.25 shr-text-white [&]:shr-shadow-none',
    'hover:shr-text-white',
    'focus-visible:shr-focus-indicator',
  ],
})

export const HeaderLink: React.FC<Props> = ({ className, ...props }) => {
  const style = headerLink({ className })
  return (
    // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
    <TextLink {...props} target="_blank" suffix={null} className={style} />
  )
}
