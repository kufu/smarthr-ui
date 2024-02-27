import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Nav } from '../SectioningContent'
import { StatusLabel } from '../StatusLabel'

import { AppNaviAnchor, AppNaviAnchorProps } from './AppNaviAnchor'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'
import { AppNaviCustomTag, AppNaviCustomTagProps } from './AppNaviCustomTag'
import { AppNaviDropdown, AppNaviDropdownProps } from './AppNaviDropdown'
import { useClassNames } from './useClassNames'

type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

type Props = {
  /** ラベルのテキスト */
  label?: ReactNode
  /** 表示するボタンの Props の配列 */
  buttons?: Array<
    AppNaviButtonProps | AppNaviAnchorProps | AppNaviDropdownProps | AppNaviCustomTagProps
  >
  /** アクティブ状態のボタンがクリック可能かどうか */
  isCurrentUnclickable?: boolean
  /** 追加で表示する内容 */
  children?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
  /** ドロップダウンにキャレットを表示するかどうか */
  displayDropdownCaret?: boolean
}

export const AppNavi: VFC<Props & ElementProps> = ({
  label,
  buttons,
  isCurrentUnclickable,
  className = '',
  children = null,
  displayDropdownCaret = false,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <WrapperNav {...props} themes={theme} className={`${className} ${classNames.wrapper}`}>
      {label && (
        <StyledStatusLabel $themes={theme} className={classNames.label}>
          {label}
        </StyledStatusLabel>
      )}

      {buttons && (
        <Buttons themes={theme} className={classNames.buttons}>
          {buttons.map((button, i) => {
            const isUnclickable = button.current && isCurrentUnclickable
            if ('tag' in button) {
              const { tag, icon, current, children: buttonChildren, ...buttonProps } = button
              return (
                <li key={i} className={classNames.listItem}>
                  <AppNaviCustomTag
                    {...buttonProps}
                    tag={tag}
                    icon={icon}
                    current={current}
                    isUnclickable={isUnclickable}
                  >
                    {buttonChildren}
                  </AppNaviCustomTag>
                </li>
              )
            }

            if ('href' in button) {
              return (
                <li key={i} className={classNames.listItem}>
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
                <li key={i} className={classNames.listItem}>
                  <AppNaviDropdown
                    dropdownContent={button.dropdownContent}
                    icon={button.icon}
                    current={button.current}
                    isUnclickable={isUnclickable}
                    displayCaret={displayDropdownCaret}
                  >
                    {button.children}
                  </AppNaviDropdown>
                </li>
              )
            }

            return (
              <li key={i} className={classNames.listItem}>
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
    </WrapperNav>
  )
}

const WrapperNav = styled(Nav)<{ themes: Theme }>`
  ${({ themes: { color, shadow, spacingByChar } }) => css`
    display: flex;
    align-items: center;
    min-width: max-content;
    box-shadow: ${shadow.LAYER1};
    background-color: ${color.WHITE};
    padding-right: ${spacingByChar(1.5)};
    padding-left: ${spacingByChar(1.5)};
  `}
`
const StyledStatusLabel = styled(StatusLabel)<{ $themes: Theme }>`
  ${({ $themes: { spacingByChar } }) => css`
    margin-right: ${spacingByChar(1)};
  `}
`
const Buttons = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    align-self: stretch;
    display: flex;
    align-items: stretch;
    gap: ${spacingByChar(1)};
    margin: 0;
    padding: 0;

    > li {
      list-style: none;
    }
  `}
`
