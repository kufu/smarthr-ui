import React, {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { Heading } from '../Heading'
import { Nav } from '../SectioningContent'
import { StatusLabel } from '../StatusLabel'

import { AppNaviAnchor, type AppNaviAnchorProps } from './AppNaviAnchor'
import { AppNaviButton, type AppNaviButtonProps } from './AppNaviButton'
import { AppNaviCustomTag, type AppNaviCustomTagProps } from './AppNaviCustomTag'
import { AppNaviDropdown, type AppNaviDropdownProps } from './AppNaviDropdown'

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

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-AppNavi',
      'shr-flex shr-min-w-max shr-items-center shr-bg-white shr-px-1.5 shr-shadow-layer-1',
    ],
    statusLabelHeading: ['smarthr-ui-AppNavi-label', 'shr-me-1 shr-shrink-0 shr-leading-none'],
    buttonsEl: [
      'smarthr-ui-AppNavi-buttons',
      'shr-flex shr-items-stretch shr-gap-1 shr-self-stretch',
    ],
    listItem: ['smarthr-ui-AppNavi-listItem', 'shr-list-none'],
    additionalAreaEl: 'shr-ms-auto',
  },
})

const { wrapper, statusLabelHeading, buttonsEl, listItem, additionalAreaEl } = classNameGenerator()
const classNames = {
  statusLabelHeading: statusLabelHeading(),
  buttonsEl: buttonsEl(),
  listItem: listItem(),
  additionalAreaEl: additionalAreaEl(),
}

export const AppNavi: FC<Props & ElementProps> = ({
  label,
  buttons,
  className,
  children,
  displayDropdownCaret,
  additionalArea,
  ...rest
}) => {
  const wrapperClassName = useMemo(() => wrapper({ className }), [className])

  return (
    <Nav {...rest} className={wrapperClassName}>
      <StatusLabelHeading>{label}</StatusLabelHeading>
      <ul className={classNames.buttonsEl}>
        {buttons &&
          buttons.map((button, i) => (
            <li key={i} className={classNames.listItem}>
              {'tag' in button ? (
                <AppNaviCustomTag {...button} />
              ) : 'href' in button ? (
                <AppNaviAnchor {...button} />
              ) : 'dropdownContent' in button ? (
                <AppNaviDropdown {...button} displayCaret={displayDropdownCaret} />
              ) : (
                <AppNaviButton {...button} />
              )}
            </li>
          ))}
        {renderButtons(children)}
      </ul>

      {additionalArea && <div className={classNames.additionalAreaEl}>{additionalArea}</div>}
    </Nav>
  )
}

const StatusLabelHeading = React.memo<PropsWithChildren>(
  ({ children }) =>
    children && (
      <Heading className={classNames.statusLabelHeading}>
        <StatusLabel>{children}</StatusLabel>
      </Heading>
    ),
)

const renderButtons = (children: ReactNode) =>
  React.Children.map(children, (child): ReactNode => {
    if (!(child && React.isValidElement(child))) {
      return null
    }

    if (child.type === React.Fragment) {
      return renderButtons(child.props.children)
    }

    return <li className={classNames.listItem}>{child}</li>
  })
