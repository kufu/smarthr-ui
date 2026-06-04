'use client'

import { type ComponentPropsWithoutRef, memo, useMemo } from 'react'

import { useIntl } from '../../intl'
import { Button } from '../Button'
import { FaFolderOpenIcon } from '../Icon'

export const SelectButton = memo<
  ComponentPropsWithoutRef<typeof Button> & { onClick: () => void; label?: string }
>(({ onClick, label, ...rest }) => {
  const { localize } = useIntl()

  const buttonLabel = useMemo(
    () =>
      label ||
      localize({
        id: 'smarthr-ui/DropZone/selectButtonLabel',
        defaultText: 'ファイルを選択',
      }),
    [label, localize],
  )

  return (
    <Button {...rest} prefix={<FaFolderOpenIcon />} onClick={onClick}>
      {buttonLabel}
    </Button>
  )
})
