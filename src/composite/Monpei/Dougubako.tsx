import React, { ComponentProps, ReactElement } from 'react'
import styled from 'styled-components'
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  FaCaretDownIcon,
  SecondaryButton,
  SecondaryButtonAnchor,
  Stack,
} from '../..'

type Actions = ActionItem | ActionItem[]
// TODO: これでコンポーネントを絞れるわけではないので linter を書く
type ActionItem =
  | ReactElement<ComponentProps<typeof SecondaryButton>>
  | ReactElement<ComponentProps<typeof SecondaryButtonAnchor>>
type Props = {
  /** 引き金となるボタンラベル。デフォルトは “その他の操作” */
  label?: string
  /** 操作群 */
  children: Actions
}

export const Dougubako: React.VFC<Props> = ({ label = 'その他の操作', children }) => (
  <Dropdown>
    <DropdownTrigger>
      <SecondaryButton suffix={<FaCaretDownIcon visuallyHiddenText="候補を開く" />}>
        {label}
      </SecondaryButton>
    </DropdownTrigger>
    <DropdownContent>
      <ActionList as="ul" gap={0}>
        {React.Children.map(children, (action, i) => (
          <ActionItem key={i}>{action}</ActionItem>
        ))}
      </ActionList>
    </DropdownContent>
  </Dropdown>
)

const ActionList = styled(Stack)`
  list-style: none;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;

  .smarthr-ui-SecondaryButton {
    border: none;
  }
`
const ActionItem = styled.li``
