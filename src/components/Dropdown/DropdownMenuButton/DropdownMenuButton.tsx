import React, {
  ButtonHTMLAttributes,
  ComponentProps,
  FC,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react'
import innerText from 'react-innertext'
import styled, { css } from 'styled-components'

import { Dropdown, DropdownContent, DropdownScrollArea, DropdownTrigger } from '..'
import { Theme, useTheme } from '../../../hooks/useTheme'
import { AnchorButton, Button, BaseProps as ButtonProps } from '../../Button'
import { RemoteDialogTrigger } from '../../Dialog'
import { FaCaretDownIcon, FaEllipsisHIcon } from '../../Icon'
import { Stack } from '../../Layout'

import { useClassNames } from './useClassNames'

type Actions = ActionItem | ActionItem[]
// これでコンポーネントを絞れるわけではないが Button[variant=text] を使ってほしいんだよ! という気持ち
type ActionItem =
  | ReactElement<ComponentProps<typeof Button>>
  | ReactElement<ComponentProps<typeof AnchorButton>>
  | ReactElement<ComponentProps<typeof RemoteDialogTrigger>>
  | null
  | boolean
type Props = {
  /** 引き金となるボタンラベル */
  label: ReactNode
  /** 操作群 */
  children: Actions
  /** 引き金となるボタンの大きさ */
  triggerSize?: ButtonProps['size']
  /** 引き金となるボタンをアイコンのみとするかどうか */
  onlyIconTrigger?: boolean
}
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props>

export const DropdownMenuButton: FC<Props & ElementProps> = ({
  label,
  children,
  triggerSize,
  onlyIconTrigger = false,
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
    <Dropdown>
      <DropdownTrigger className={`${classNames.wrapper}${className && ` ${className}`}`}>
        <TriggerButton
          {...props}
          suffix={triggerSuffix}
          size={triggerSize}
          square={onlyIconTrigger}
          className={classNames.trigger}
        >
          {triggerLabel}
        </TriggerButton>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownScrollArea>
          <ActionList themes={themes} className={classNames.panel}>
            {React.Children.map(children, (item, i) =>
              // MEMO: {flag && <Button/>}のような書き方に対応させるためbooleanの判定を入れています
              item && typeof item !== 'boolean' ? <li key={i}>{actionItem(item)}</li> : null,
            )}
          </ActionList>
        </DropdownScrollArea>
      </DropdownContent>
    </Dropdown>
  )
}

const TriggerButton = styled(Button)`
  &[aria-expanded='true'] .smarthr-ui-Icon:last-child {
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
      width: 100%;
      border-style: none;
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
