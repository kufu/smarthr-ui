import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, ReactNode } from 'react'
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
  /** 表示するボタンの Props の配列
   * @deprecated AppNaviButton などのコンポーネントを組み合わせて組み上げてください
   */
  buttons?: Array<
    AppNaviButtonProps | AppNaviAnchorProps | AppNaviDropdownProps | AppNaviCustomTagProps
  >
  /** ドロップダウンにキャレットを表示するかどうか
   * @deprecated キャレットの省略は非推奨です
   */
  displayDropdownCaret?: boolean
  /** 追加の領域 */
  additionalArea?: ReactNode
}>

const appNavi = tv({
  slots: {
    wrapper: [
      'smarthr-ui-AppNavi',
      'shr-flex shr-min-w-max shr-items-center shr-bg-white shr-px-1.5 shr-shadow-layer-1',
    ],
    statusLabel: ['smarthr-ui-AppNavi-label', 'shr-me-1 shr-shrink-0'],
    buttonsEl: [
      'smarthr-ui-AppNavi-buttons',
      'shr-flex shr-items-stretch shr-gap-1 shr-self-stretch',
    ],
    listItem: ['smarthr-ui-AppNavi-listItem', 'shr-list-none'],
    additionalAreaEl: 'shr-ms-auto',
  },
})

const { wrapper, statusLabel, buttonsEl, listItem, additionalAreaEl } = appNavi()

export const AppNavi: FC<Props & ElementProps> = ({
  label,
  buttons,
  className,
  children,
  displayDropdownCaret = false,
  additionalArea,
  ...props
}) => (
  // eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content
  <Nav {...props} className={wrapper({ className })}>
    {label && <StatusLabel className={statusLabel()}>{label}</StatusLabel>}

    <ul className={buttonsEl()}>
      {buttons &&
        buttons.map((button, i) => {
          if ('tag' in button) {
            return (
              <li key={i} className={listItem()}>
                <AppNaviCustomTag {...button} />
              </li>
            )
          }

          if ('href' in button) {
            return (
              <li key={i} className={listItem()}>
                <AppNaviAnchor {...button} />
              </li>
            )
          }

          if ('dropdownContent' in button) {
            return (
              <li key={i} className={listItem()}>
                <AppNaviDropdown {...button} displayCaret={displayDropdownCaret} />
              </li>
            )
          }

          return (
            <li key={i} className={listItem()}>
              <AppNaviButton {...button} />
            </li>
          )
        })}
      {renderButtons(children)}
    </ul>

    {additionalArea && <div className={additionalAreaEl()}>{additionalArea}</div>}
  </Nav>
)

const renderButtons = (children: ReactNode) =>
  React.Children.map(children, (child): ReactNode => {
    if (!(child && React.isValidElement(child))) {
      return null
    }

    if (child.type === React.Fragment) {
      return renderButtons(child.props.children)
    }

    return <li className={listItem()}>{child}</li>
  })
