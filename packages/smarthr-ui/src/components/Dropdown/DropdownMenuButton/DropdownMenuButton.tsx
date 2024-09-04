import React, {
  ComponentProps,
  ComponentPropsWithRef,
  ComponentType,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { Dropdown, DropdownContent, DropdownScrollArea, DropdownTrigger } from '..'
import { AnchorButton, Button, BaseProps as ButtonProps } from '../../Button'
import { RemoteDialogTrigger } from '../../Dialog'
import { FaCaretDownIcon, FaEllipsisIcon } from '../../Icon'

type Actions = ActionItem | ActionItem[]

// これでコンポーネントを絞れるわけではないが Button[variant=text] を使ってほしいんだよ! という気持ち
type ActionItemTruthyType =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
  | ReactElement<ComponentProps<typeof RemoteDialogTrigger>>
// HINT: このコンポーネントは以下のような記法で利用される場合が多いため、判定に利用されうる型を許容する
// <DropdownMenuButton>{hoge && <Button {...props} />}</DropdownMenuButton>
type ActionItemFalsyType = null | undefined | boolean | 0 | ''
type ActionItem = ActionItemTruthyType | ActionItemFalsyType

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
  const containerRef = React.useRef<HTMLDivElement>(null)

  const triggerLabel = useMemo(() => {
    const Icon = TriggerIcon || FaEllipsisIcon
    return onlyIconTrigger ? (
      <Icon alt={typeof label === 'string' ? label : innerText(label)} />
    ) : (
      label
    )
  }, [label, TriggerIcon, onlyIconTrigger])
  const triggerSuffix = useMemo(
    // eslint-disable-next-line react/jsx-no-useless-fragment
    () => (onlyIconTrigger ? <></> : <FaCaretDownIcon alt="候補を開く" />),
    [onlyIconTrigger],
  )

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current || !document.activeElement) {
      return
    }

    const allItems = Array.from(containerRef.current.querySelectorAll('li > *'))
    const {
      hoveredItem,
      tabbableItems: enabledItems,
      focusedIndex,
    } = allItems.reduce(
      (
        acc: {
          hoveredItem: Element | null
          tabbableItems: Element[]
          focusedIndex: number
        },
        item,
      ) => {
        if (item.matches(':hover') && acc.hoveredItem === null) {
          acc.hoveredItem = item
        }

        // NOTE: disalbedの判定は、自身がdisabledか、または子要素にdisabledがあるかで判定する。
        const isDisabled =
          item.matches(':disabled') ||
          Array.from(item.children).some((child) => child.matches(':disabled'))

        if (isDisabled) {
          return acc
        }

        acc.tabbableItems.push(item)
        if (document.activeElement === item) {
          acc.focusedIndex = acc.tabbableItems.length - 1
        }

        return acc
      },
      {
        hoveredItem: null,
        tabbableItems: [],
        focusedIndex: -1,
      },
    )

    if (e.key === 'Up' || e.key === 'ArrowUp' || e.key === 'Left' || e.key === 'ArrowLeft') {
      const calculateNextIndex = () => {
        // MEMO: itemにフォーカスがない && ホバー状態のアイテムがある場合は、その一つ前のアイテムをフォーカスする
        if (focusedIndex < 0 && hoveredItem) {
          return enabledItems.indexOf(hoveredItem) - 1
        }

        // MEMO: フォーカスされているアイテムが最前列の場合は、最後尾のアイテムをフォーカスする
        if (focusedIndex <= 0) {
          return enabledItems.length - 1
        }

        return focusedIndex - 1
      }

      const nextIndex = calculateNextIndex()
      const nextItem = enabledItems[nextIndex]

      if (nextItem instanceof HTMLElement) {
        nextItem.focus()
      }
    }

    if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'Right' || e.key === 'ArrowRight') {
      const calculateNextIndex = () => {
        // MEMO: フォーカスされているアイテムが最後尾の場合は、最初のアイテムをフォーカスする
        if (focusedIndex > -1) {
          return (focusedIndex + 1) % enabledItems.length
        }

        // MEMO: itemにフォーカスがない && ホバー状態のアイテムがある場合は、その一つ後のアイテムをフォーカスする
        if (hoveredItem) {
          return (enabledItems.indexOf(hoveredItem) + 1) % enabledItems.length
        }

        return 0
      }

      const nextIndex = calculateNextIndex()
      const nextItem = enabledItems[nextIndex]

      if (nextItem instanceof HTMLElement) {
        nextItem.focus()
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

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
        <DropdownScrollArea as="ul" ref={containerRef} className={actionListStyle}>
          {React.Children.map(children, (item, i) =>
            // MEMO: {flag && <Button/>}のような書き方に対応させる為、型を変換する
            // itemの存在チェックでfalsyな値は弾かれている想定
            item ? <li key={i}>{actionItem(item as ActionItemTruthyType)}</li> : null,
          )}
        </DropdownScrollArea>
      </DropdownContent>
    </Dropdown>
  )
}

const actionItem = (item: ReactElement) => React.cloneElement(item, { variant: 'text', wide: true })
