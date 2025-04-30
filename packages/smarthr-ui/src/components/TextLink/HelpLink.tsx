import { type ComponentPropsWithoutRef, type FC, memo } from 'react'

import { FaCircleQuestionIcon } from '../Icon'

import { TextLink } from './TextLink'

type Props = Omit<ComponentPropsWithoutRef<typeof TextLink>, 'rel' | 'prefix' | 'suffix'>

export const HelpLink: FC<Props> = memo(({ target, ...rest }) => (
  <TextLink
    {...rest}
    rel="help"
    referrerPolicy="no-referrer-when-downgrade"
    target={target}
    prefix={!target && <FaCircleQuestionIcon />}
  />
))
