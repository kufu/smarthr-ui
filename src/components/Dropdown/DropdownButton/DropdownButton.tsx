import React, { ComponentProps, HTMLAttributes, ReactElement, ReactNode, VFC, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { AnchorButton, Button, BaseProps as ButtonProps } from '../../Button'
import { Dropdown, DropdownContent, DropdownTrigger } from '../'
import { FaCaretDownIcon, FaEllipsisHIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Theme, useTheme } from '../../../hooks/useTheme'
import { useClassNames } from './useClassNames'
import innerText from 'react-innertext'

type Actions = ActionItem | ActionItem[]
// これでコンポーネントを絞れるわけではないが Button[variant=text] を使ってほしいんだよ! という気持ち
type ActionItem =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
  | null
  | boolean
type Props = {
  /** 引き金となるボタンラベル。デフォルトは “その他の操作” */
  label?: string
  /** 引き金となるボタンラベルの装飾 */
  labelDecorator?: (text: string) => ReactNode
  /** 操作群 */
  children: Actions
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIconTrigger?: boolean
  /** 引き金となるボタンの `disabled` 属性の値 */
  disabled?: boolean
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const DropdownButton: VFC<Props & ElementProps> = ({
  label = '適用中',
  children,
  triggerSize,
  onlyIconTrigger = false,
  disabled = false,
  className = '',
  labelDecorator,
  ...props
}) => {
  const themes = useTheme()
  const classNames = useClassNames()

  const labelComponent = useMemo(
    () => (labelDecorator ? labelDecorator(label) : label),
    [label, labelDecorator],
  )

  const triggerLabel = useMemo(
    () =>
      onlyIconTrigger ? (
        <FaEllipsisHIcon
          alt={typeof labelComponent === 'string' ? labelComponent : innerText(labelComponent)}
        />
      ) : (
        labelComponent
      ),
    [onlyIconTrigger, labelComponent],
  )
  const triggerSuffix = useMemo(
    () => (onlyIconTrigger ? <></> : <FaCaretDownIcon alt="候補を開く" />),
    [onlyIconTrigger],
  )

  return (
    <Dropdown {...props}>
      <DropdownTrigger className={`${classNames.wrapper}${className && ` ${className}`}`}>
        <TriggerButton
          suffix={triggerSuffix}
          size={triggerSize}
          disabled={disabled}
          square={onlyIconTrigger}
          className={classNames.trigger}
        >
          {triggerLabel}
        </TriggerButton>
      </DropdownTrigger>
      <DropdownContent>
        <ActionList themes={themes} className={classNames.panel}>
          {React.Children.map(children, (item, i) =>
            // MEMO: {flag && <Button/>}のような書き方に対応させるためbooleanの判定を入れています
            item && typeof item !== 'boolean' ? <li key={i}>{actionItem(item)}</li> : null,
          )}
        </ActionList>
      </DropdownContent>
    </Dropdown>
  )
}

const TriggerButton = styled(Button)`
  &[aria-expanded='true'] .smarthr-ui-Icon {
    transform: rotate(0.5turn);
  }
`
const ActionList = styled(Stack).attrs({ as: 'ul', gap: 0 })<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    list-style: none;
    margin-block: 0;
    padding-block: ${spacingByChar(0.5)};
    padding-inline-start: 0;

    .smarthr-ui-Button,
    .smarthr-ui-AnchorButton {
      justify-content: flex-start;

      padding-block: ${spacingByChar(0.5)};
      font-weight: normal;
    }
  `}
`
const actionItem = (item: ReactElement) => React.cloneElement(item, { variant: 'text', wide: true })
