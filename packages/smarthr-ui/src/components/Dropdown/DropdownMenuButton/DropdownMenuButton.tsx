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
      'shr-justify-start shr-rounded-none shr-border-none shr-py-0.5 shr-font-normal',
      'focus-visible:shr-focus-indicator--inner',
    ],
  },
})

const { triggerWrapper, triggerButton, actionList, actionListItemButton } = dropdownMenuButton()

export const DropdownMenuButton: FC<Props & ElementProps> = ({
  label,
  children,
  triggerSize,
  onlyIconTrigger,
  triggerIcon,
  className,
  ...rest
}) => {
  const containerRef = React.useRef<HTMLUListElement>(null)

  useKeyboardNavigation(containerRef)

  const styles = useMemo(
    () => ({
      triggerWrapper: triggerWrapper({ className }),
      triggerButton: triggerButton(),
      actionList: actionList(),
    }),
    [className],
  )

  return (
    <Dropdown>
      <MemoizedTriggerButton
        {...rest}
        label={label}
        onlyIconTrigger={onlyIconTrigger}
        triggerIcon={triggerIcon}
        triggerSize={triggerSize}
        wrapperStyle={styles.triggerWrapper}
        buttonStyle={styles.triggerButton}
      />
      <DropdownContent>
        <menu ref={containerRef} className={styles.actionList}>
          {renderButtonList(children)}
        </menu>
      </DropdownContent>
    </Dropdown>
  )
}

const MemoizedTriggerButton = React.memo<
  Pick<Props, 'onlyIconTrigger' | 'triggerSize' | 'label' | 'triggerIcon'> &
    ElementProps & { wrapperStyle: string; buttonStyle: string }
>(({ onlyIconTrigger, triggerSize, label, triggerIcon, wrapperStyle, buttonStyle, ...rest }) => {
  const tooltip = useMemo(
    () => ({ show: onlyIconTrigger, message: label }),
    [label, onlyIconTrigger],
  )

  return (
    <DropdownTrigger className={wrapperStyle} tooltip={tooltip}>
      <Button
        {...rest}
        suffix={<ButtonSuffixIcon onlyIconTrigger={onlyIconTrigger} />}
        size={triggerSize}
        square={onlyIconTrigger}
        className={buttonStyle}
      >
        <TriggerLabelText
          label={label}
          onlyIconTrigger={onlyIconTrigger}
          triggerIcon={triggerIcon}
        />
      </Button>
    </DropdownTrigger>
  )
})

const TriggerLabelText = React.memo<Pick<Props, 'label' | 'onlyIconTrigger' | 'triggerIcon'>>(
  ({ label, onlyIconTrigger, triggerIcon }) => {
    if (!onlyIconTrigger) {
      return label
    }

    const Icon = triggerIcon || FaEllipsisIcon

    return <Icon alt={typeof label === 'string' ? label : innerText(label)} />
  },
)

const ButtonSuffixIcon = React.memo<Pick<Props, 'onlyIconTrigger'>>(
  ({ onlyIconTrigger }) => !onlyIconTrigger && <FaCaretDownIcon alt="候補を開く" />,
)

export const renderButtonList = (children: Actions) =>
  React.Children.map(children, (item): ReactNode => {
    if (!item || !React.isValidElement(item)) {
      return null
    }

    switch (item.type) {
      case React.Fragment:
        return renderButtonList(item.props.children)
      case DropdownMenuGroup:
        return item
    }

    const actualElement = React.cloneElement(item as ReactElement, {
      variant: 'text',
      wide: true,
      className: actionListItemButton({ className: item.props.className }),
    })

    return <li>{actualElement}</li>
  })
