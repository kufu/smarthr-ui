import React, { ComponentProps, PropsWithChildren } from 'react'

import { TextLink } from '../TextLink'

type Props = PropsWithChildren<ComponentProps<typeof TextLink>>

export const HeaderLink: React.FC<Props> = (props) => (
  <TextLink
    {...props}
    href={props.href}
    target="_blank"
    suffix={null}
    className="focus-visible:shr-focusIndicator shr-pe-0.25 shr-ps-0.25 shr-text-white hover:shr-text-white [&&&]:shr-shadow-none"
  />
)
