'use client'

import {
  Children,
  type ComponentProps,
  type ComponentPropsWithRef,
  type ComponentType,
  type FC,
  Fragment,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
  memo,
  useContext,
  useMemo,
  useRef,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { Dropdown, DropdownCloser, DropdownContent, DropdownMenuGroup, DropdownTrigger } from '..'
import { type AnchorButton, Button, type BaseProps as ButtonProps } from '../../Button'
import { FaCaretDownIcon, FaEllipsisIcon } from '../../Icon'
import { DropdownContext } from '../Dropdown'

import useKeyboardNavigation from './useKeyboardNavigation'

import type { RemoteDialogTrigger } from '../../Dialog'

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
  /** ドロップダウンメニューが開かれた際のイベント */
  onOpen?: () => void
  /** ドロップダウンメニューが閉じられた際のイベント */
  onClose?: () => void
}
type ElementProps = Omit<ComponentPropsWithRef<'button'>, keyof Props>

const classNameGenerator = tv({
  slots: {
    triggerWrapper: 'smarthr-ui-DropdownMenuButton',
    triggerButton:
      'smarthr-ui-DropdownMenuButton-trigger [&[aria-expanded="true"]_.smarthr-ui-Icon:last-child]:shr-rotate-180',
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

const { triggerWrapper, triggerButton, actionList, actionListItemButton } = classNameGenerator()

export const DropdownMenuButton: FC<Props & ElementProps> = ({
  label,
  children,
  triggerSize,
  onlyIconTrigger,
  triggerIcon,
  onOpen,
  onClose,
  className,
  ...rest
}) => {
  const containerRef = useRef<HTMLUListElement>(null)

  useKeyboardNavigation(containerRef)

  const classNames = useMemo(
    () => ({
      triggerWrapper: triggerWrapper({ className }),
      triggerButton: triggerButton(),
      actionList: actionList(),
    }),
    [className],
  )

  return (
    <Dropdown onOpen={onOpen} onClose={onClose}>
      <MemoizedTriggerButton
        {...rest}
        label={label}
        onlyIconTrigger={onlyIconTrigger}
        triggerIcon={triggerIcon}
        triggerSize={triggerSize}
        classNames={classNames}
      />
      <DropdownContent controllable={true}>
        <menu ref={containerRef} role="menu" className={classNames.actionList}>
          {renderButtonList(children)}
        </menu>
      </DropdownContent>
    </Dropdown>
  )
}

const MemoizedTriggerButton = memo<
  Pick<Props, 'onlyIconTrigger' | 'triggerSize' | 'label' | 'triggerIcon'> &
    ElementProps & {
      classNames: {
        triggerWrapper: string
        triggerButton: string
      }
    }
>(({ onlyIconTrigger, triggerSize, label, triggerIcon, classNames, ...rest }) => {
  const { active } = useContext(DropdownContext)

  const tooltip = useMemo(
    () => ({ show: onlyIconTrigger, message: label }),
    [label, onlyIconTrigger],
  )

  return (
    <DropdownTrigger className={classNames.triggerWrapper} tooltip={tooltip}>
      <Button
        {...rest}
        suffix={!onlyIconTrigger && <FaCaretDownIcon alt={`候補を${active ? '閉じる' : '開く'}`} />}
        size={triggerSize}
        className={classNames.triggerButton}
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

const TriggerLabelText = memo<Pick<Props, 'label' | 'onlyIconTrigger' | 'triggerIcon'>>(
  ({ label, onlyIconTrigger, triggerIcon }) => {
    if (!onlyIconTrigger) {
      return label
    }

    const Icon = triggerIcon || FaEllipsisIcon

    return <Icon alt={typeof label === 'string' ? label : innerText(label)} />
  },
)

export const renderButtonList = (children: Actions) =>
  Children.map(children, (item): ReactNode => {
    if (!item || !isValidElement(item)) {
      return null
    }

    switch (item.type) {
      case Fragment:
        return renderButtonList(item.props.children)
      case DropdownMenuGroup:
        return item
    }

    return (
      <li role="menuitem">
        <DropdownCloser>
          {cloneElement(item as ReactElement, {
            variant: 'text',
            wide: true,
            className: actionListItemButton({ className: item.props.className }),
          })}
        </DropdownCloser>
      </li>
    )
  })
