import React, { ComponentProps, PropsWithChildren } from 'react'

import { TextLink } from '../TextLink'

type Props = PropsWithChildren<ComponentProps<typeof TextLink>>

export const HeaderLink: React.FC<Props> = (props) => (
  <TextLink
    {...props}
    href={props.href}
    target="_blank"
    suffix={null}
    className="smarthr-ui-header-link shr-pe-0.25 shr-ps-0.25 shr-text-white shr-shadow-none focus-visible:shr-focus-indicator hover:shr-text-white [&:not(focus-visible)]:shr-shadow-none"
  />
)
