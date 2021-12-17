import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { StatusLabel as StatusLabelComponent } from '../StatusLabel/StatusLabel'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'
import { AppNaviAnchor, AppNaviAnchorProps } from './AppNaviAnchor'
import { AppNaviDropdown, AppNaviDropdownProps } from './AppNaviDropdown'
import { AppNaviCustomTag, AppNaviCustomTagProps } from './AppNaviCustomTag'
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
  displayDrodownCaret?: boolean
}

export const AppNavi: VFC<Props & ElementProps> = ({
  label,
  buttons,
  isCurrentUnclickable,
  className = '',
  children = null,
  displayDrodownCaret = false,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper themes={theme} className={`${className} ${classNames.wrapper}`} {...props}>
      {label && (
        <StatusLabel themes={theme} className={classNames.label}>
          {label}
        </StatusLabel>
      )}

      {buttons && (
        <Buttons themes={theme} className={classNames.buttons}>
          {buttons.map((button, i) => {
            const isUnclickable = button.current && isCurrentUnclickable
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
                    displayCaret={displayDrodownCaret}
                  >
                    {button.children}
                  </AppNaviDropdown>
                </li>
              )
            }

            if ('tag' in button) {
              const { tag, icon, current, children: buttonChildren, ...buttonProps } = button
              return (
                <li key={i} className={classNames.listItem}>
                  <AppNaviCustomTag
                    tag={tag}
                    icon={icon}
                    current={current}
                    isUnclickable={isUnclickable}
                    {...buttonProps}
                  >
                    {buttonChildren}
                  </AppNaviCustomTag>
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
    </Wrapper>
  )
}

const Wrapper = styled.nav<{ themes: Theme }>`
  ${({ themes: { color, shadow, spacingByChar } }) => {
    return css`
      display: flex;
      align-items: center;
      box-shadow: ${shadow.LAYER1};
      background-color: ${color.WHITE};
      padding-right: ${spacingByChar(1.5)};
      padding-left: ${spacingByChar(1.5)};
    `
  }}
`
const StatusLabel = styled(StatusLabelComponent)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      margin-right: ${spacingByChar(1)};
    `
  }}
`
const Buttons = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      display: flex;
      align-items: center;
      gap: ${spacingByChar(1)};
      margin: 0;
      padding: 0;

      > li {
        list-style: none;
      }
    `
  }}
`
