import React, { ComponentProps, ReactElement, VFC, useMemo } from 'react'
import styled, { css } from 'styled-components'

import {
  AnchorButton,
  Button,
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  FaCaretDownIcon,
  FaEllipsisHIcon,
  Stack,
} from '../../..'
import { Theme, useTheme } from '../../../hooks/useTheme'
import { BaseProps as ButtonProps } from '../../Button/types'

type Actions = ActionItem | ActionItem[]
// これでコンポーネントを絞れるわけではないが Button[variant=text] を使ってほしいんだよ! という気持ち
type ActionItem =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
type Props = {
  /** 引き金となるボタンラベル。デフォルトは “その他の操作” */
  label?: string
  /** 操作群 */
  children: Actions
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIconTrigger?: boolean
  /** 引き金となるボタンの `disabled` 属性の値 */
  disabled?: boolean
}

export const DropdownButton: VFC<Props> = ({
  label = 'その他の操作',
  children,
  triggerSize,
  onlyIconTrigger = false,
  disabled = false,
}) => {
  const themes = useTheme()
  const triggerLabel = useMemo(
    () => (onlyIconTrigger ? <FaEllipsisHIcon visuallyHiddenText={label} /> : label),
    [onlyIconTrigger, label],
  )
  const triggerSuffix = useMemo(
    () => (onlyIconTrigger ? <></> : <FaCaretDownIcon visuallyHiddenText="候補を開く" />),
    [onlyIconTrigger],
  )

  return (
    <Dropdown>
      <DropdownTrigger>
        <Trigger
          suffix={triggerSuffix}
          size={triggerSize}
          disabled={disabled}
          square={onlyIconTrigger}
        >
          {triggerLabel}
        </Trigger>
      </DropdownTrigger>
      <DropdownContent>
        <ActionList themes={themes}>
          {React.Children.map(children, (item, i) => (
            <li key={i}>{actionItem(item)}</li>
          ))}
        </ActionList>
      </DropdownContent>
    </Dropdown>
  )
}

const Trigger = styled(Button)`
  &[aria-expanded='true'] .smarthr-ui-Icon {
    transform: rotate(0.5turn);
  }
`
const ActionList = styled(Stack).attrs({ as: 'ul', gap: 0 })<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    list-style: none;
    margin-block: 0;
    padding-block: ${spacingByChar(0.5)};
    padding-inline-start: 0;

    .smarthr-ui-Button,
    .smarthr-ui-AnchorButton {
      justify-content: flex-start;

      padding-block: ${spacingByChar(0.5)};
      font-weight: normal;
    }
  `}
`
const actionItem = (item: ReactElement) => React.cloneElement(item, { variant: 'text', wide: true })
