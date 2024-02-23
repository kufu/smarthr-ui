import React, { ComponentProps } from 'react'

import { TextLink } from '../TextLink'

type Props = ComponentProps<typeof TextLink>

export const HeaderLink: React.FC<Props> = (props) => (
  // eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute
  <TextLink
    {...props}
    target="_blank"
    suffix={null}
    className="shr-px-0.25 shr-text-white focus-visible:shr-focus-indicator hover:shr-text-white [&]:shr-shadow-none"
  />
)
