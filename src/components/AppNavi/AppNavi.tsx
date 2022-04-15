import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { StatusLabel } from '../StatusLabel/StatusLabel'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'
import { AppNaviAnchor, AppNaviAnchorProps } from './AppNaviAnchor'
import { AppNaviDropdown, AppNaviDropdownProps } from './AppNaviDropdown'
import { AppNaviCustomTag, AppNaviCustomTagProps } from './AppNaviCustomTag'
import { useClassNames } from './useClassNames'
import { Dropdown, DropdownContent, DropdownScrollArea, DropdownTrigger } from '../Dropdown'
import { FaEllipsisHIcon } from '../Icon'
import { TextButton } from '../Button'
import { Stack } from '../Layout'

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
  /** Buttonをドロップダウンにまとめる画面幅 */
  switchMenuScreenWidth?: string
}

export const AppNavi: VFC<Props & ElementProps> = ({
  label,
  buttons,
  isCurrentUnclickable,
  className = '',
  children = null,
  displayDrodownCaret = false,
  switchMenuScreenWidth,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper
      themes={theme}
      changeBreakPoint={switchMenuScreenWidth}
      className={`${className} ${classNames.wrapper}`}
      {...props}
    >
      {label && <StatusLabel className={classNames.label}>{label}</StatusLabel>}

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
      {switchMenuScreenWidth != null && (
        <div className={classNames.menuWrapper}>
          <Dropdown>
            <DropdownTrigger>
              <TextButton aria-haspopup="menu">
                <FaEllipsisHIcon visuallyHiddenText="Menu" />
              </TextButton>
            </DropdownTrigger>
            <DropdownContent controllable>
              <DropdownScrollArea>
                <Menus as="ul" themes={theme} className="menus" gap={0.5}>
                  {buttons &&
                    buttons.map((button, i) => {
                      const isUnclickable = button.current && isCurrentUnclickable
                      if ('href' in button) {
                        return (
                          <li key={i} className={classNames.listItem}>
                            <AppNaviAnchor
                              href={button.href}
                              icon={button.icon}
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
                              isUnclickable={isUnclickable}
                              displayCaret={displayDrodownCaret}
                            >
                              {button.children}
                            </AppNaviDropdown>
                          </li>
                        )
                      }

                      if ('tag' in button) {
                        const { tag, icon, children: buttonChildren, ...buttonProps } = button
                        return (
                          <li key={i} className={classNames.listItem}>
                            <AppNaviCustomTag
                              tag={tag}
                              icon={icon}
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
                            onClick={button.onClick}
                            isUnclickable={isUnclickable}
                          >
                            {button.children}
                          </AppNaviButton>
                        </li>
                      )
                    })}
                </Menus>
              </DropdownScrollArea>
            </DropdownContent>
          </Dropdown>
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.nav<{ themes: Theme; changeBreakPoint?: string }>`
  ${({ themes: { color, shadow, spacingByChar }, changeBreakPoint }) => {
    return css`
      display: flex;
      align-items: center;
      min-width: max-content;
      box-shadow: ${shadow.LAYER1};
      background-color: ${color.WHITE};
      gap: ${spacingByChar(1)};
      padding-right: ${spacingByChar(1.5)};
      padding-left: ${spacingByChar(1.5)};

      .smarthr-ui-AppNavi-menuWrapper {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
      }

      ${changeBreakPoint &&
      `
      .smarthr-ui-AppNavi-buttons {
        display: none;
      }
          @media (min-width: ${changeBreakPoint}) {
            .smarthr-ui-AppNavi-buttons {
              display: flex;
            }

            .smarthr-ui-AppNavi-menuWrapper {
              display: none;
            }
          }        
        `}
    `
  }}
`

const Menus = styled(Stack)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      list-style: none;
      margin: 0;
      padding: ${spacingByChar(0.5)};

      & > li {
        display: flex;
        flex-direction: column;
      }
    `
  }}
`

const Buttons = styled.ul<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      align-self: stretch;
      display: flex;
      align-items: stretch;
      gap: ${spacingByChar(1)};
      margin: 0;
      padding: 0;

      > li {
        list-style: none;
      }
    `
  }}
`
