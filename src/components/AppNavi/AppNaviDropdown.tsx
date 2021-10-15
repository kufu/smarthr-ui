import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Dropdown, DropdownContent, DropdownTrigger } from '../Dropdown'
import { FaCaretDownIcon, ComponentProps as IconProps } from '../Icon'
import { ItemStyleProps, getIconComponent, getItemStyle } from './appNaviHelper'

export type AppNaviDropdownProps = {
  children: ReactNode
  dropdownContent: ReactNode
  icon?: React.ComponentType<IconProps>
  current?: boolean
  displayCaret?: boolean
}

type InnerProps = AppNaviDropdownProps & {
  isUnclickable?: boolean
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
      <DropdownTrigger>
        <TriggerButton
          themes={theme}
          aria-current={current ? 'page' : undefined}
          isActive={current}
          disabled={isUnclickable}
          isUnclickable={isUnclickable}
          type="button"
          displayCaret={displayCaret}
        >
          {iconComponent}
          {children}
          {displayCaret && (
            <IconWrapper themes={theme}>
              <FaCaretDownIcon />
            </IconWrapper>
          )}
        </TriggerButton>
      </DropdownTrigger>

      <DropdownContent>{dropdownContent}</DropdownContent>
    </Dropdown>
  )
}

const TriggerButton = styled.button<ItemStyleProps & { displayCaret?: boolean }>(
  ({ displayCaret, ...props }) => css`
    ${getItemStyle(props)}

    ${displayCaret &&
    css`
      &[aria-expanded='true'] {
        .smarthr-ui-Icon:last-child {
          transform: rotate(0.5turn);
        }
      }
    `}
  `,
)
const IconWrapper = styled.span<{ themes: Theme }>(
  ({ themes: { spacingByChar } }) => css`
    display: flex;
    margin-left: ${spacingByChar(0.5)};
  `,
)
