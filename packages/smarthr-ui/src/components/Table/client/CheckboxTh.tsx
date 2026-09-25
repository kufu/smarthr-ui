'use client'

import { useLocalize } from '../../../intl'
import { Th } from '../Th'

import type { ComponentProps, FC } from 'react'

type Props = Omit<ComponentProps<typeof Th>, 'aria-label'>

export const CheckboxTh: FC<Props> = ({ children, ...rest }) => {
  const localized = useLocalize({
    checkColumnName: {
      id: 'smarthr-ui/ThCheckbox/checkColumnName',
      defaultText: '選択',
    },
  })

  return (
    <Th {...rest} aria-label={localized.checkColumnName}>
      {children}
    </Th>
  )
}
