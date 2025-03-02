import React, { type FC, type PropsWithChildren, type ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { DropdownMenuButton } from '../Dropdown/DropdownMenuButton/DropdownMenuButton'

const classNameGenerator = tv({
  base: [
    'smarthr-ui-AppNavi-dropdownMenuButton',
    [
      '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-border-none',
      '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.5',
      '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-text-grey',
      '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-rounded-none',
    ],
    [
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:shr-relative',
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:shr-text-black',
    ],
    [
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-content-[""]',
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-absolute',
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-bottom-0',
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-inset-x-0',
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-h-0.25',
      '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current=page])]:after:shr-bg-main',
    ],
  ],
})

type Props = PropsWithChildren<{
  /** 引き金となるボタンラベル */
  label: ReactNode
}>

export const AppNaviDropdownMenuButton: FC<Props> = ({ label, children }) => {
  const className = useMemo(() => classNameGenerator(), [])

  return (
    <DropdownMenuButton
      label={
        <>
          {label}
          <span hidden>
            {
              // has([aria-current="page"]) を書くために複製
              children
            }
          </span>
        </>
      }
      className={className}
    >
      {children}
    </DropdownMenuButton>
  )
}
