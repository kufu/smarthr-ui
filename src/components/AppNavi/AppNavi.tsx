import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Nav } from '../SectioningContent'
import { StatusLabel } from '../StatusLabel'

import { AppNaviAnchor, AppNaviAnchorProps } from './AppNaviAnchor'
import { AppNaviButton, AppNaviButtonProps } from './AppNaviButton'
import { AppNaviCustomTag, AppNaviCustomTagProps } from './AppNaviCustomTag'
import { AppNaviDropdown, AppNaviDropdownProps } from './AppNaviDropdown'

type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props>

type Props = PropsWithChildren<{
  /** ラベルのテキスト */
  label?: ReactNode
  /** 表示するボタンの Props の配列 */
  buttons?: Array<
    AppNaviButtonProps | AppNaviAnchorProps | AppNaviDropdownProps | AppNaviCustomTagProps
  >
  /** アクティブ状態のボタンがクリック可能かどうか */
  isCurrentUnclickable?: boolean
  /** ドロップダウンにキャレットを表示するかどうか */
  displayDropdownCaret?: boolean
}>

const appNavi = tv({
  slots: {
    wrapper: [
      'smarthr-ui-AppNavi',
      'shr-flex shr-min-w-max shr-items-center shr-bg-white shr-px-1.5 shr-shadow-layer-1',
    ],
    statusLabel: ['smarthr-ui-AppNavi-label', 'shr-me-1'],
    buttonsEl: [
      'smarthr-ui-AppNavi-buttons',
      'shr-flex shr-items-stretch shr-gap-1 shr-self-stretch',
    ],
    listItem: ['smarthr-ui-AppNavi-listItem', 'shr-list-none'],
  },
})

export const AppNavi: FC<Props & ElementProps> = ({
  label,
  buttons,
  isCurrentUnclickable,
  className,
  children,
  displayDropdownCaret = false,
  ...props
}) => {
  const { wrapperStyle, statusLabelStyle, buttonsStyle, listItemStyle } = useMemo(() => {
    const { wrapper, statusLabel, buttonsEl, listItem } = appNavi()
    return {
      wrapperStyle: wrapper({ className }),
      statusLabelStyle: statusLabel(),
      buttonsStyle: buttonsEl(),
      listItemStyle: listItem(),
    }
  }, [className])

  return (
    <Nav {...props} className={wrapperStyle}>
      {label && <StatusLabel className={statusLabelStyle}>{label}</StatusLabel>}

      {buttons && (
        <ul className={buttonsStyle}>
          {buttons.map((button, i) => {
            const isUnclickable = button.current && isCurrentUnclickable
            if ('tag' in button) {
              const { tag, icon, current, children: buttonChildren, ...buttonProps } = button
              return (
                <li key={i} className={listItemStyle}>
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
                <li key={i} className={listItemStyle}>
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
                <li key={i} className={listItemStyle}>
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
              <li key={i} className={listItemStyle}>
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
        </ul>
      )}

      {children}
    </Nav>
  )
}
