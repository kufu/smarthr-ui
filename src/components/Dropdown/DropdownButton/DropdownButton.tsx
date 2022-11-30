import React, { ComponentProps, HTMLAttributes, ReactElement, ReactNode, VFC, useMemo } from 'react'
import innerText from 'react-innertext'
import styled, { css } from 'styled-components'

import { Dropdown, DropdownContent, DropdownTrigger } from '..'
import { Theme, useTheme } from '../../../hooks/useTheme'
import { AnchorButton, Button, BaseProps as ButtonProps } from '../../Button'
import { FaCaretDownIcon, FaEllipsisHIcon } from '../../Icon'
import { Stack } from '../../Layout'

import { useClassNames } from './useClassNames'

type Actions = ActionItem | ActionItem[]
// これでコンポーネントを絞れるわけではないが Button[variant=text] を使ってほしいんだよ! という気持ち
type ActionItem =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
  | null
  | boolean
type Props = {
  /** 引き金となるボタンラベル。デフォルトは “その他の操作” */
  label?: ReactNode
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
  label = 'その他の操作',
  children,
  triggerSize,
  onlyIconTrigger = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const themes = useTheme()
  const classNames = useClassNames()

  const triggerLabel = useMemo(
    () =>
      onlyIconTrigger ? (
        <FaEllipsisHIcon alt={typeof label === 'string' ? label : innerText(label)} />
      ) : (
        label
      ),
    [onlyIconTrigger, label],
  )
  const triggerSuffix = useMemo(
    // eslint-disable-next-line react/jsx-no-useless-fragment
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
  ${({ themes: { space } }) => css`
    list-style: none;
    margin-block: 0;
    padding-block: ${space(0.5)};
    padding-inline-start: 0;

    .smarthr-ui-Button,
    .smarthr-ui-AnchorButton {
      justify-content: flex-start;

      padding-block: ${space(0.5)};
      font-weight: normal;
    }

    .smarthr-ui-Button-disabledWrapper {
      /* unset した Button の右 padding 分 */
      padding-inline-end: ${space(1)};

      > [disabled] {
        padding-inline-end: unset;
        width: unset;
      }
    }
  `}
`
const actionItem = (item: ReactElement) => React.cloneElement(item, { variant: 'text', wide: true })
