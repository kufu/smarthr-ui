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
    // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
    <Nav {...props} className={wrapperStyle}>
      {label && <StatusLabel className={statusLabelStyle}>{label}</StatusLabel>}

      {buttons && (
        <ul className={buttonsStyle}>
          {buttons.map((button, i) => {
            if ('tag' in button) {
              return (
                <li key={i} className={listItemStyle}>
                  <AppNaviCustomTag {...button} />
                </li>
              )
            }

            if ('href' in button) {
              return (
                <li key={i} className={listItemStyle}>
                  {/* eslint-disable-next-line smarthr/a11y-anchor-has-href-attribute */}
                  <AppNaviAnchor {...button} />
                </li>
              )
            }

            if ('dropdownContent' in button) {
              return (
                <li key={i} className={listItemStyle}>
                  <AppNaviDropdown {...button} displayCaret={displayDropdownCaret} />
                </li>
              )
            }

            return (
              <li key={i} className={listItemStyle}>
                <AppNaviButton {...button} />
              </li>
            )
          })}
        </ul>
      )}

      {children}
    </Nav>
  )
}
