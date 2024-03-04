import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { UnstyledButton } from '../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { FaCaretDownIcon, ComponentProps as IconProps } from '../Icon'

import { ItemStyleProps, getIconComponent, getItemStyle } from './appNaviHelper'

export type AppNaviDropdownProps = {
  /** ボタンのテキスト */
  children: ReactNode
  /** ドロップダウンのコンテンツ */
  dropdownContent: ReactNode
  /** 表示するアイコンタイプ */
  icon?: React.ComponentType<IconProps>
  /** アクティブ状態であるかどうか */
  current?: boolean
}

type InnerProps = AppNaviDropdownProps & {
  isUnclickable?: boolean
  displayCaret?: boolean
}

export const AppNaviDropdown: VFC<InnerProps> = ({
  children,
  dropdownContent,
  icon,
  current = false,
  isUnclickable = false,
  displayCaret,
}) => {
  const theme = useTheme()
  const iconComponent = getIconComponent(theme, { icon, current })

  return (
    <Dropdown>
      <StyledDropdownTrigger>
        <TriggerButton
          $themes={theme}
          aria-current={current ? 'page' : undefined}
          disabled={isUnclickable}
          $displayCaret={displayCaret}
          $isActive={current}
          $isUnclickable={isUnclickable}
        >
          {iconComponent}
          {children}
          {displayCaret && <FaCaretDownIcon />}
        </TriggerButton>
      </StyledDropdownTrigger>

      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}

const StyledDropdownTrigger = styled(DropdownTrigger)`
  height: 100%;
`
const TriggerButton = styled(UnstyledButton)<
  ItemStyleProps & {
    $displayCaret?: boolean
  }
>(
  ({ $displayCaret, ...props }) => css`
    ${getItemStyle(props)}

    ${$displayCaret &&
    css`
      &[aria-expanded='true'] {
        .smarthr-ui-Icon:last-child {
          transform: rotate(0.5turn);
        }
      }
    `}
  `,
)
