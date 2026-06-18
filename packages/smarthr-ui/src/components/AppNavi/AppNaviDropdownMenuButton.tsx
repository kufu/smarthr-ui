import { tv } from 'tailwind-variants'

import { DropdownMenuButton } from '../Dropdown'

import type { FC, PropsWithChildren, ReactNode } from 'react'

type Props = PropsWithChildren<{
  /** 引き金となるボタンラベル */
  label: ReactNode
  onOpen?: () => void
  onClose?: () => void
}>

const classNameGenerator = tv({
  slots: {
    trigger: [
      'smarthr-ui-AppNavi-dropdownMenuButton',
      [
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-border-none',
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-px-0.5',
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-text-grey',
        '[&_.smarthr-ui-DropdownMenuButton-trigger]:shr-rounded-none',
      ],
      [
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:shr-relative',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:shr-text-black',
      ],
      [
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-content-[""]',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-absolute',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-bottom-0',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-inset-x-0',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-h-0.25',
        '[&_.smarthr-ui-DropdownMenuButton-trigger:has([aria-current])]:after:shr-bg-main',
      ],
      // HINT: DropdownMenuButton内で設定されるclassNameより優先度を上げる必要がある
      [
        '[&&_button[aria-current="page"]]:shr-bg-grey-9',
        '[&&_button[aria-current="page"]]:shr-font-bold',
        '[&&_a[aria-current="page"]]:shr-bg-grey-9',
        '[&&_a[aria-current="page"]]:shr-font-bold',
      ],
      ['[&&_button:hover]:shr-bg-head-darken', '[&&_a:hover]:shr-bg-head-darken'],
    ],
  },
})
const { trigger } = classNameGenerator()

export const AppNaviDropdownMenuButton: FC<Props> = ({ label, onOpen, onClose, children }) => (
  <DropdownMenuButton
    trigger={
      <>
        {label}
        {/* has([aria-current="page"]) を書くために複製 */}
        <span hidden>{children}</span>
      </>
    }
    onOpen={onOpen}
    onClose={onClose}
    className={trigger()}
  >
    {children}
  </DropdownMenuButton>
)
