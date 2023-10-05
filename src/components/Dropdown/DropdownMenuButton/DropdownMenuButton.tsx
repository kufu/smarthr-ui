import React, {
  ButtonHTMLAttributes,
  ComponentProps,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import styled, { css } from 'styled-components'

import { Dropdown, DropdownContent, DropdownScrollArea, DropdownTrigger } from '..'
import { Theme, useTheme } from '../../../hooks/useTheme'
import { AnchorButton, Button, BaseProps as ButtonProps } from '../../Button'
import { RemoteDialogTrigger } from '../../Dialog'
import { FaCaretDownIcon, FaEllipsisHIcon } from '../../Icon'
import { Stack } from '../../Layout'

import { useClassNames } from './useClassNames'

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
}
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props>

export const DropdownMenuButton: FC<Props & ElementProps> = ({
  label,
  children,
  triggerSize,
  onlyIconTrigger = false,
  className = '',
  ...props
}) => {
  const themes = useTheme()
  const classNames = useClassNames()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const triggerLabel = useMemo(
    () =>
      onlyIconTrigger ? (
        <FaEllipsisHIcon alt={typeof label === 'string' ? label : innerText(label)} />
      ) : (
        label
      ),
    [onlyIconTrigger, label],
  )
  const triggerSuffix = useMemo(
    // eslint-disable-next-line react/jsx-no-useless-fragment
    () => (onlyIconTrigger ? <></> : <FaCaretDownIcon alt="候補を開く" />),
    [onlyIconTrigger],
  )

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!containerRef.current || !document.activeElement) {
      return
    }

    const allItems = Array.from(containerRef.current.querySelectorAll("li > *"))
    const {
        hoveredItem,
        tabbableItems: enabledItems,
        focusedIndex
    } = allItems.reduce((acc: {
        hoveredItem: Element | null;
        tabbableItems: Element[];
        focusedIndex: number;
    }, item) => {
        if (item.matches(":hover") && acc.hoveredItem === null) {
            acc.hoveredItem = item;
        }

        // NOTE: disalbedの判定は、自身がdisabledか、または子要素にdisabledがあるかで判定する。
        const isDisabled = item.matches(":disabled") || Array.from(item.children).some(child => child.matches(':disabled'));

        if (isDisabled) {
          return acc
        }

        acc.tabbableItems.push(item);
        if (document.activeElement === item) {
          acc.focusedIndex = acc.tabbableItems.length - 1;
        }

        return acc
    }, {
        hoveredItem: null,
        tabbableItems: [],
        focusedIndex: -1
    });

    if (e.key === 'Up' || e.key === 'ArrowUp' || e.key === 'Left' || e.key === 'ArrowLeft') {
      const calculateNextIndex = () => {
        // MEMO: itemにフォーカスがない && ホバー状態のアイテムがある場合は、その一つ前のアイテムをフォーカスする
        if (focusedIndex < 0 && hoveredItem) {
            return enabledItems.indexOf(hoveredItem) - 1;
        }

        // MEMO: フォーカスされているアイテムが最前列の場合は、最後尾のアイテムをフォーカスする
        if (focusedIndex <= 0) {
            return enabledItems.length - 1;
        }
        
          return focusedIndex - 1
      }

      const nextIndex = calculateNextIndex()
      const nextItem = enabledItems[nextIndex]

      if(nextItem instanceof HTMLElement) {
        nextItem.focus()
      }
    }

    if (e.key === 'Down' || e.key === 'ArrowDown' || e.key === 'Right' || e.key === 'ArrowRight') {
      const calculateNextIndex = () => {
          // MEMO: フォーカスされているアイテムが最後尾の場合は、最初のアイテムをフォーカスする
          if (focusedIndex > -1) {
              return (focusedIndex + 1) % enabledItems.length;
          }
          
          // MEMO: itemにフォーカスがない && ホバー状態のアイテムがある場合は、その一つ後のアイテムをフォーカスする
          if (hoveredItem) {
              return (enabledItems.indexOf(hoveredItem) + 1) % enabledItems.length;
          }
          
          return 0;
      }

      const nextIndex = calculateNextIndex()
      const nextItem = enabledItems[nextIndex]

      if(nextItem instanceof HTMLElement) {
        nextItem.focus()
      }

    }
  },[])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown )
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <Dropdown>
      <DropdownTrigger className={`${classNames.wrapper}${className && ` ${className}`}`}>
        <TriggerButton
          {...props}
          suffix={triggerSuffix}
          size={triggerSize}
          square={onlyIconTrigger}
          className={classNames.trigger}
        >
          {triggerLabel}
        </TriggerButton>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownScrollArea>
          <ActionList ref={containerRef} themes={themes} className={classNames.panel}>
            {React.Children.map(children, (item, i) =>
              // MEMO: {flag && <Button/>}のような書き方に対応させる為、型を変換する
              // itemの存在チェックでfalsyな値は弾かれている想定
              item ? <li key={i}>{actionItem(item as ActionItemTruthyType)}</li> : null,
            )}
          </ActionList>
        </DropdownScrollArea>
      </DropdownContent>
    </Dropdown>
  )
}

const TriggerButton = styled(Button)`
  &[aria-expanded='true'] .smarthr-ui-Icon:last-child {
    transform: rotate(0.5turn);
  }
`
const ActionList = styled(Stack).attrs({ as: 'ul', gap: 0 })<{ themes: Theme }>`
  ${({ themes: { space } }) => css`
    list-style: none;
    margin-block: 0;
    padding: ${space(0.5)} ${space(0.25)};

    .smarthr-ui-Button,
    .smarthr-ui-AnchorButton {
      width: 100%;
      border-style: none;
      justify-content: flex-start;

      padding-block: ${space(0.5)};
      font-weight: normal;
    }

    .smarthr-ui-Button-disabledWrapper {
      column-gap: ${space(0.5)};

      /* unset した Button の右 padding 分 */
      padding-inline-end: ${space(1)};

      > [disabled] {
        padding-inline-end: unset;
        width: unset;
      }
    }
  `}
`
const actionItem = (item: ReactElement) => React.cloneElement(item, { variant: 'text', wide: true })
