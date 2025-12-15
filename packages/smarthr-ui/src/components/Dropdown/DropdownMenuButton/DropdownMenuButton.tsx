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
  isValidElement,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { Dropdown, DropdownCloser, DropdownContent, DropdownMenuGroup, DropdownTrigger } from '..'
import { useIntl } from '../../../intl'
import { type AnchorButton, Button, type AbstractProps as ButtonProps } from '../../Button'
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

type ObjectTriggerType = {
  /** 引き金となるボタンラベル */
  children: ReactNode
  /** 引き金となるボタンの大きさ */
  size?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIcon?:
    | boolean
    | {
        /** 引き金となるアイコンを差し替えたい場合（onlyIcon=true の場合のみ有効） */
        component?: ComponentType<ComponentProps<typeof FaCaretDownIcon>>
      }
}
type AbstractProps = {
  /** 引き金となるボタン */
  trigger: ReactNode | ObjectTriggerType
  /** 操作群 */
  children: Actions
  /** ドロップダウンメニューが開かれた際のイベント */
  onOpen?: () => void
  /** ドロップダウンメニューが閉じられた際のイベント */
  onClose?: () => void
}
type ElementProps = Omit<ComponentPropsWithRef<'button'>, keyof AbstractProps>
type Props = AbstractProps & ElementProps

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
        '[&_.smarthr-ui-Button-disabledWrapper_>_.smarthr-ui-Button]:shr-w-[unset] [&_.smarthr-ui-Button-disabledWrapper_>_.smarthr-ui-Button]:shr-bg-transparent [&_.smarthr-ui-Button-disabledWrapper_>_.smarthr-ui-Button]:shr-pe-[unset]',
      ],
    ],
    actionListItemButton: [
      // HINT: 実際にレンダリングされた要素のclassに対して追加されるため、優先度を上げる必要がある
      '[&&]:shr-w-full [&&]:shr-justify-start [&&]:shr-rounded-none [&&]:shr-border-none [&&]:shr-py-0.5 [&&]:shr-font-normal',
      '[&&]:focus-visible:shr-focus-indicator',
    ],
  },
})

const { triggerWrapper, triggerButton, actionList, actionListItemButton } = classNameGenerator()

export const DropdownMenuButton: FC<Props> = ({
  trigger,
  children,
  onOpen,
  onClose,
  className,
  ...rest
}) => {
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const {
    children: triggerChildren,
    size: triggerSize,
    onlyIcon: onlyIconTrigger,
  }: ObjectTriggerType = !trigger || typeof trigger !== 'object' || isValidElement(trigger)
    ? {
        children: trigger as ReactNode,
      }
    : (trigger as ObjectTriggerType)

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
        children={triggerChildren}
        onlyIconTrigger={onlyIconTrigger}
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
  ElementProps & {
    onlyIconTrigger: ObjectTriggerType['onlyIcon']
    triggerSize: ObjectTriggerType['size']
    children: ObjectTriggerType['children']
    classNames: {
      triggerWrapper: string
      triggerButton: string
    }
  }
>(({ onlyIconTrigger, triggerSize, children, classNames, ...rest }) => {
  const { localize } = useIntl()

  const { active } = useContext(DropdownContext)

  const showTooltip = !!onlyIconTrigger
  const tooltip = useMemo(() => ({ show: showTooltip, message: children }), [children, showTooltip])

  return (
    <DropdownTrigger className={classNames.triggerWrapper} tooltip={tooltip}>
      <Button
        {...rest}
        suffix={
          !onlyIconTrigger && (
            <FaCaretDownIcon
              alt={
                active
                  ? localize({
                      id: 'smarthr-ui/DropdownMenuButton/triggerActive',
                      defaultText: '候補を閉じる',
                    })
                  : localize({
                      id: 'smarthr-ui/DropdownMenuButton/triggerInactive',
                      defaultText: '候補を開く',
                    })
              }
            />
          )
        }
        size={triggerSize}
        className={classNames.triggerButton}
      >
        <TriggerLabelText children={children} onlyIconTrigger={onlyIconTrigger} />
      </Button>
    </DropdownTrigger>
  )
})

const TriggerLabelText = memo<{
  onlyIconTrigger: ObjectTriggerType['onlyIcon']
  children: ObjectTriggerType['children']
}>(({ children, onlyIconTrigger }) => {
  if (!onlyIconTrigger) {
    return children
  }

  const Icon = (typeof onlyIconTrigger === 'object' && onlyIconTrigger.component) || FaEllipsisIcon

  return <Icon alt={typeof children === 'string' ? children : innerText(children)} />
})

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

    return <ButtonListItem>{item}</ButtonListItem>
  })

const ButtonListItem: FC<{ children: ReactElement }> = ({ children }) => {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const button = ref.current.querySelector('button,a')

    if (button) {
      button.setAttribute('role', 'menuitem')
      button.setAttribute(
        'class',
        actionListItemButton({ className: button.getAttribute('class') }),
      )
    }
  }, [children])

  return (
    <li role="presentation" ref={ref}>
      <DropdownCloser>{children}</DropdownCloser>
    </li>
  )
}
