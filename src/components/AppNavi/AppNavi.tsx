import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { StatusLabel as StatusLabelComponent } from '../StatusLabel/StatusLabel'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'
import { AppNaviAnchor, AppNaviAnchorProps } from './AppNaviAnchor'
import { AppNaviDropdown, AppNaviDropdownProps } from './AppNaviDropdown'
import { AppNaviCustomTag, AppNaviCustomTagProps } from './AppNaviCustomTag'

interface Props {
  label?: string
  buttons?: Array<
    AppNaviButtonProps | AppNaviAnchorProps | AppNaviDropdownProps | AppNaviCustomTagProps
  >
  isCurrentUnclickable?: boolean
  children?: ReactNode
}

export const AppNavi: FC<Props> = ({ label, buttons, isCurrentUnclickable, children = null }) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme}>
      {label && <StatusLabel themes={theme}>{label}</StatusLabel>}

      {buttons && (
        <Buttons themes={theme}>
          {buttons.map((button, i) => {
            const isUnclickable = button.current && isCurrentUnclickable
            if ('href' in button) {
              return (
                <li key={i}>
                  <AppNaviAnchor
                    href={button.href}
                    icon={button.icon}
                    current={button.current}
                    isUnclickable={isUnclickable}
                  >
                    {button.children}
                  </AppNaviAnchor>
                </li>
              )
            }

            if ('dropdownContent' in button) {
              return (
                <li key={i}>
                  <AppNaviDropdown
                    dropdownContent={button.dropdownContent}
                    icon={button.icon}
                    current={button.current}
                    disabled={button.disabled}
                  >
                    {button.children}
                  </AppNaviDropdown>
                </li>
              )
            }

            if ('tag' in button) {
              const { tag, icon, current, children: buttonChildren, ...props } = button
              return (
                <li key={i}>
                  <AppNaviCustomTag
                    tag={tag}
                    icon={icon}
                    current={current}
                    disabled={button.disabled}
                    {...props}
                  >
                    {buttonChildren}
                  </AppNaviCustomTag>
                </li>
              )
            }

            return (
              <li key={i}>
                <AppNaviButton
                  icon={button.icon}
                  current={button.current}
                  onClick={button.onClick}
                  isUnclickable={isUnclickable}
                >
                  {button.children}
                </AppNaviButton>
              </li>
            )
          })}
        </Buttons>
      )}

      {children}
    </Wrapper>
  )
}

const Wrapper = styled.nav<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem } = themes.size

    return css`
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      padding: 0 ${pxToRem(20)};
      background-color: #fff;
      box-sizing: border-box;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    `
  }}
`
const StatusLabel = styled(StatusLabelComponent)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-right: ${pxToRem(space.XS)};
    `
  }}
`
const Buttons = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0;

      > li {
        list-style: none;

        &:not(:first-child) {
          margin-left: ${pxToRem(space.XS)};
        }
      }
    `
  }}
`
