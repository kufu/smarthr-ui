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
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { useCallbackRefCleanupForReact18 } from '../../../hooks/useCallbackRefCleanupForReact18'
import { useObjectAttributes } from '../../../hooks/useObjectAttributes'
import { Localizer } from '../../../intl'
import { type AnchorButton, Button, type BaseProps as ButtonProps } from '../../Button'
import { FaCaretDownIcon, FaEllipsisIcon } from '../../Icon'
import { Dropdown, DropdownContext } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownTrigger } from '../DropdownTrigger'

import { DropdownMenuGroup } from './DropdownMenuGroup'

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
type BaseProps = {
  /** 引き金となるボタン */
  trigger: ReactNode | ObjectTriggerType
  /** 操作群 */
  children: Actions
  /** ドロップダウンメニューが開かれた際のイベント */
  onOpen?: () => void
  /** ドロップダウンメニューが閉じられた際のイベント */
  onClose?: () => void
}
type ElementProps = Omit<ComponentPropsWithRef<'button'>, keyof BaseProps>
type Props = BaseProps & ElementProps

const TABBABLE_SELECTOR = 'li button,li a,li [tabindex]:not([tabindex="-1"])'
const DISABLED_SELECTOR = ':disabled,[aria-disabled="true"]'
const isElementEnabled = (element: Element): boolean =>
  !element.matches(DISABLED_SELECTOR) && !element.querySelector(DISABLED_SELECTOR)
const KEY_UP_REGEX = /^(Arrow)?(Up|Left)$/
const KEY_DOWN_REGEX = /^(Arrow)?(Down|Right)$/

const moveFocus = (element: Element, direction: 1 | -1) => {
  let hoveredItem: Element | null = null
  const tabbableItems: Element[] = []
  let focusedIndex: number = -1

  const pushTabbaleItem = (item: Element) => {
    tabbableItems.push(item)

    if (document.activeElement === item) {
      focusedIndex = tabbableItems.length - 1
    }
  }

  element.querySelectorAll(TABBABLE_SELECTOR).forEach((item) => {
    if (hoveredItem === null && item.matches(':hover')) {
      hoveredItem = item
    }

    if (isElementEnabled(item)) {
      pushTabbaleItem(item)
    }
  })

  let nextIndex = 0

  if (focusedIndex > -1) {
    // フォーカスされているアイテムが存在する場合
    nextIndex = (focusedIndex + direction + tabbableItems.length) % tabbableItems.length
  } else if (hoveredItem) {
    // ホバー状態のアイテムが存在する場合
    nextIndex =
      (tabbableItems.indexOf(hoveredItem) + direction + tabbableItems.length) % tabbableItems.length
  } else if (direction === -1) {
    nextIndex = tabbableItems.length - 1
  }

  const nextItem = tabbableItems[nextIndex]

  if (nextItem instanceof HTMLElement) {
    nextItem.focus()
  }
}

const triggerObjectConverter = (trigger: ReactNode) => ({
  children: trigger,
})

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
  const {
    children: triggerChildren,
    size: triggerSize,
    onlyIcon: onlyIconTrigger,
  } = useObjectAttributes<ReactNode | ObjectTriggerType, ObjectTriggerType>(
    trigger,
    triggerObjectConverter,
  )

  const classNames = useMemo(
    () => ({
      triggerWrapper: triggerWrapper({ className }),
      triggerButton: triggerButton(),
      actionList: actionList(),
    }),
    [className],
  )

  const callbackRef = useCallbackRefCleanupForReact18(
    useCallback((node: HTMLElement | null) => {
      if (!node) {
        return
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!document.activeElement) {
          return
        }

        let direction: -1 | 0 | 1 = 0

        // HINT: tabとarrow keyで挙動を揃えるため、tabもhandling対象にする
        if (e.key === 'Tab') {
          // HINT: tbのデフォルトの挙動の場合のみ、preventDefaultが必要
          e.preventDefault()
          direction = e.shiftKey ? -1 : 1
        } else if (KEY_UP_REGEX.test(e.key)) {
          direction = -1
        } else if (KEY_DOWN_REGEX.test(e.key)) {
          direction = 1
        }

        if (direction !== 0) {
          moveFocus(node, direction)
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, []),
  )

  return (
    <Dropdown onOpen={onOpen} onClose={onClose}>
      <MemoizedTriggerButton
        {...rest}
        onlyIconTrigger={onlyIconTrigger}
        triggerSize={triggerSize}
        classNames={classNames}
      >
        {triggerChildren}
      </MemoizedTriggerButton>
      <DropdownContent controllable={true}>
        <menu ref={callbackRef} role="menu" className={classNames.actionList}>
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
  const { active } = useContext(DropdownContext)

  return (
    <DropdownTrigger
      className={classNames.triggerWrapper}
      tooltip={{ show: !!onlyIconTrigger, message: children }}
    >
      <Button
        {...rest}
        suffix={
          !onlyIconTrigger && (
            <FaCaretDownIcon
              alt={
                active ? (
                  <Localizer
                    id="smarthr-ui/DropdownMenuButton/triggerActive"
                    defaultText="候補を閉じる"
                  />
                ) : (
                  <Localizer
                    id="smarthr-ui/DropdownMenuButton/triggerInactive"
                    defaultText="候補を開く"
                  />
                )
              }
            />
          )
        }
        size={triggerSize}
        className={classNames.triggerButton}
      >
        <TriggerLabelText onlyIconTrigger={onlyIconTrigger}>{children}</TriggerLabelText>
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

  return <Icon alt={children} />
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
    const listItem = ref.current
    if (!listItem) {
      return
    }

    const setupButton = () => {
      const button = listItem.querySelector('button,a')

      if (button) {
        button.setAttribute('role', 'menuitem')
        button.setAttribute(
          'class',
          actionListItemButton({ className: button.getAttribute('class') }),
        )
      }
    }

    setupButton()

    const observer = new MutationObserver(setupButton)
    observer.observe(listItem, {
      childList: true,
      subtree: true,
      // button要素の disabled / aria-disabled が動的に変化した場合も検知してリスナーを貼り直す
      attributes: true,
      attributeFilter: ['disabled', 'aria-disabled'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <li role="presentation" ref={ref}>
      <DropdownCloser>{children}</DropdownCloser>
    </li>
  )
}
