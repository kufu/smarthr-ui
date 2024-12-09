'use client'

import React, {
  type ComponentProps,
  type ComponentPropsWithRef,
  type ComponentType,
  type FC,
  type ReactElement,
  type ReactNode,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { Dropdown, DropdownContent, DropdownMenuGroup, DropdownTrigger } from '..'
import { AnchorButton, Button, BaseProps as ButtonProps } from '../../Button'
import { RemoteDialogTrigger } from '../../Dialog'
import { FaCaretDownIcon, FaEllipsisIcon } from '../../Icon'

import useKeyboardNavigation from './useKeyboardNavigation'

type Actions = ActionItem | ActionItem[]

// これでコンポーネントを絞れるわけではないが Button[variant=text] を使ってほしいんだよ! という気持ち
type ActionItem =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
  | ReactElement<ComponentProps<typeof RemoteDialogTrigger>>
  | ReactNode

type Props = {
  /** 引き金となるボタンラベル */
  label: ReactNode
  /** 操作群 */
  children: Actions
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIconTrigger?: boolean
  /** 引き金となるアイコンを差し替えたい場合（onlyIconTrigger=true の場合のみ有効） */
  triggerIcon?: ComponentType<ComponentProps<typeof FaCaretDownIcon>>
}
type ElementProps = Omit<ComponentPropsWithRef<'button'>, keyof Props>

export const dropdownMenuButton = tv({
  slots: {
    triggerWrapper: 'smarthr-ui-DropdownMenuButton',
    triggerButton:
      'smarthr-ui-DropdownMenuButton-trigger [&[aria-expanded="true"]>.smarthr-ui-Icon:last-child]:shr-rotate-180',
    actionList: [
      'smarthr-ui-DropdownMenuButton-panel',
      'shr-list-none shr-py-0.5',
      [
        /* unset した Button の右 padding 分 */
        '[&_.smarthr-ui-Button-disabledWrapper]:shr-pe-1',
        '[&_.smarthr-ui-Button-disabledWrapper]:shr-gap-x-0.5',
        '[&_.smarthr-ui-Button-disabledWrapper_>_.smarthr-ui-Button]:shr-w-[unset] [&_.smarthr-ui-Button-disabledWrapper_>_.smarthr-ui-Button]:shr-pe-[unset]',
      ],
    ],
    actionListItemButton: [
      'shr-justify-start shr-border-none shr-py-0.5 shr-font-normal',
      'focus-visible:shr-focus-indicator--inner',
    ],
  },
})

const { triggerWrapper, triggerButton, actionList, actionListItemButton } = dropdownMenuButton()

export const DropdownMenuButton: FC<Props & ElementProps> = ({
  label,
  children,
  triggerSize,
  onlyIconTrigger = false,
  triggerIcon: TriggerIcon,
  className,
  ...props
}) => {
  const containerRef = React.useRef<HTMLUListElement>(null)

  const triggerLabel = useMemo(() => {
    const Icon = TriggerIcon || FaEllipsisIcon
    return onlyIconTrigger ? (
      <Icon alt={typeof label === 'string' ? label : innerText(label)} />
    ) : (
      label
    )
  }, [label, TriggerIcon, onlyIconTrigger])
  const triggerSuffix = useMemo(
    () => (onlyIconTrigger ? undefined : <FaCaretDownIcon alt="候補を開く" />),
    [onlyIconTrigger],
  )

  useKeyboardNavigation(containerRef)

  return (
    <Dropdown>
      <DropdownTrigger className={triggerWrapper({ className })}>
        <Button
          {...props}
          suffix={triggerSuffix}
          size={triggerSize}
          square={onlyIconTrigger}
          className={triggerButton()}
        >
          {triggerLabel}
        </Button>
      </DropdownTrigger>
      <DropdownContent>
        <menu ref={containerRef} className={actionList()}>
          {renderButtonList(children)}
        </menu>
      </DropdownContent>
    </Dropdown>
  )
}

export const renderButtonList = (children: Actions) =>
  React.Children.map(children, (item): ReactNode => {
    if (!(item && React.isValidElement(item))) return null
    if (item.type === React.Fragment) {
      return renderButtonList(item.props.children)
    }

    if (item.type === DropdownMenuGroup) {
      return item
    }

    const actualElement = React.cloneElement(item as ReactElement, {
      variant: 'text',
      wide: true,
      className: actionListItemButton({ className: item.props.className }),
    })

    return <li>{actualElement}</li>
  })
