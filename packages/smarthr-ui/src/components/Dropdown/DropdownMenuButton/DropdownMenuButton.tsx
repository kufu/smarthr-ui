import React, {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentType,
  FC,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { Dropdown, DropdownContent, DropdownTrigger } from '..'
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
      'shr-my-0 shr-list-none shr-px-0.25 shr-py-0.5',
      '[&_.smarthr-ui-Button]:shr-w-full [&_.smarthr-ui-Button]:shr-justify-start [&_.smarthr-ui-Button]:shr-border-none [&_.smarthr-ui-Button]:shr-py-0.5 [&_.smarthr-ui-Button]:shr-font-normal',
      '[&_.smarthr-ui-AnchorButton]:shr-w-full [&_.smarthr-ui-AnchorButton]:shr-justify-start [&_.smarthr-ui-AnchorButton]:shr-border-none [&_.smarthr-ui-AnchorButton]:shr-py-0.5 [&_.smarthr-ui-AnchorButton]:shr-font-normal',
      [
        /* unset した Button の右 padding 分 */
        '[&_.smarthr-ui-Button-disabledWrapper]:shr-pe-1',
        '[&_.smarthr-ui-Button-disabledWrapper]:shr-gap-x-0.5',
        '[&_.smarthr-ui-Button-disabledWrapper_>_.smarthr-ui-Button]:shr-w-[unset] [&_.smarthr-ui-Button-disabledWrapper_>_.smarthr-ui-Button]:shr-pe-[unset]',
      ],
      // hover 時に背景の白が出るので隠している
      '[&_li:hover]:-shr-mx-0.25 [&_li:hover]:shr-bg-white-darken [&_li:hover]:shr-px-0.25',
    ],
  },
})

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

  const { triggerWrapperStyle, triggerButtonStyle, actionListStyle } = useMemo(() => {
    const { triggerWrapper, triggerButton, actionList } = dropdownMenuButton()
    return {
      triggerWrapperStyle: triggerWrapper({ className }),
      triggerButtonStyle: triggerButton(),
      actionListStyle: actionList(),
    }
  }, [className])

  return (
    <Dropdown>
      <DropdownTrigger className={triggerWrapperStyle}>
        <Button
          {...props}
          suffix={triggerSuffix}
          size={triggerSize}
          square={onlyIconTrigger}
          className={triggerButtonStyle}
        >
          {triggerLabel}
        </Button>
      </DropdownTrigger>
      <DropdownContent>
        <ul ref={containerRef} className={actionListStyle}>
          {React.Children.map(children, (item) => actionItem(item))}
        </ul>
      </DropdownContent>
    </Dropdown>
  )
}

// MEMO: {flag && <Button/>} のような書き方に対応させている
const actionItem = (item: ReactNode) => {
  if (!(item && React.isValidElement(item))) return null

  const actualElement = React.cloneElement(item as ReactElement, { variant: 'text', wide: true })
  return <li>{actualElement}</li>
}
