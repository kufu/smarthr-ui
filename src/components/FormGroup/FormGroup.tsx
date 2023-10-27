import React, {
  ComponentProps,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { useSpacing } from '../../hooks/useSpacing'
import { Theme, useTheme } from '../../hooks/useTheme'
import { MultiComboBox, SingleComboBox } from '../ComboBox'
import { DatePicker } from '../DatePicker'
import { DropZone } from '../DropZone'
import { HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'
import { CurrencyInput, Input } from '../Input'
import { InputFile } from '../InputFile'
import { Cluster, Stack } from '../Layout'
import { Select } from '../Select'
import { StatusLabel } from '../StatusLabel'
import { Text } from '../Text'
import { Textarea } from '../Textarea'

import { useClassNames } from './useClassNames'

import type { Gap } from '../../types'
type StatusLabelProps = ComponentProps<typeof StatusLabel>

type Props = PropsWithChildren<{
  /** グループのタイトル名 */
  title: ReactNode
  /** タイトルの見出しのタイプ */
  titleType?: HeadingTypes
  /** label 要素に適用する `htmlFor` 値 */
  htmlFor?: string
  /** label 要素に適用する `id` 値 */
  labelId?: string
  /** タイトル群と子要素の間の間隔調整用（基本的には不要） */
  innerMargin?: Gap
  /** タイトルの隣に表示する `StatusLabel` の Props の配列 */
  statusLabelProps?: StatusLabelProps | StatusLabelProps[]
  /** タイトルの下に表示するヘルプメッセージ */
  helpMessage?: ReactNode
  /** タイトルの下に表示する入力例 */
  exampleMessage?: ReactNode
  /** タイトルの下に表示するエラーメッセージ */
  errorMessages?: ReactNode | ReactNode[]
  /** フォームコントロールの下に表示する補足メッセージ */
  supplementaryMessage?: ReactNode
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
  as?: string | React.ComponentType<any>
}>
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-labelledby'>

/**
 * @deprecated `FormGroup` コンポーネントは非推奨です。代わりに `FormControl` や `Fieldset` を使ってください。
 */
export const FormGroup: React.FC<Props & ElementProps> = ({
  title,
  titleType = 'blockTitle',
  htmlFor,
  labelId,
  innerMargin,
  statusLabelProps = [],
  helpMessage,
  exampleMessage,
  errorMessages,
  supplementaryMessage,
  disabled,
  as = 'div',
  className = '',
  children,
  ...props
}) => {
  const disabledClass = disabled ? 'disabled' : ''
  const managedHtmlFor = useId(htmlFor)
  const managedLabelId = useId(labelId)
  const isRoleGroup = as === 'fieldset'
  const statusLabelList = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps]

  const theme = useTheme()
  const classNames = useClassNames()
  const describedbyIds = useMemo(
    () =>
      Object.entries({ helpMessage, exampleMessage, supplementaryMessage, errorMessages })
        .filter(({ 1: value }) => value)
        .map(([key]) => `${managedHtmlFor}_${key}`)
        .join(' '),
    [helpMessage, exampleMessage, supplementaryMessage, errorMessages, managedHtmlFor],
  )

  return (
    <Wrapper
      {...props}
      disabled={disabled}
      aria-labelledby={isRoleGroup ? managedLabelId : undefined}
      aria-describedby={isRoleGroup && describedbyIds ? describedbyIds : undefined}
      themes={theme}
      className={`${className} ${disabledClass} ${classNames.wrapper}`}
      as={as}
    >
      <FormLabel
        htmlFor={!isRoleGroup ? managedHtmlFor : undefined}
        id={managedLabelId}
        className={`${classNames.label}`}
        as={isRoleGroup ? 'legend' : 'label'}
      >
        <GroupLabel styleType={titleType}>{title}</GroupLabel>
        {statusLabelList.length > 0 && (
          <Cluster gap={0.25} as="span">
            {statusLabelList.map((statusLabelProp, index) => (
              <StatusLabel {...statusLabelProp} key={index} />
            ))}
          </Cluster>
        )}
      </FormLabel>

      {helpMessage && (
        <p className={classNames.helpMessage} id={`${managedHtmlFor}_helpMessage`}>
          {helpMessage}
        </p>
      )}
      {exampleMessage && (
        <Text
          as="p"
          color="TEXT_GREY"
          italic
          id={`${managedHtmlFor}_exampleMessage`}
          className={classNames.exampleMessage}
        >
          {exampleMessage}
        </Text>
      )}

      {errorMessages && (
        <Stack gap={0} id={`${managedHtmlFor}_errorMessages`}>
          {(Array.isArray(errorMessages) ? errorMessages : [errorMessages]).map(
            (message, index) => (
              <ErrorMessage themes={theme} key={index}>
                <FaExclamationCircleIcon text={message} className={classNames.errorMessage} />
              </ErrorMessage>
            ),
          )}
        </Stack>
      )}

      <ChildrenWrapper innerMargin={innerMargin} isRoleGroup={isRoleGroup}>
        {addIdToFirstInput(children, managedHtmlFor, describedbyIds)}
      </ChildrenWrapper>

      {supplementaryMessage && (
        <Text
          as="p"
          size="S"
          color="TEXT_GREY"
          id={`${managedHtmlFor}_supplementaryMessage`}
          className={classNames.supplementaryMessage}
        >
          {supplementaryMessage}
        </Text>
      )}
    </Wrapper>
  )
}

const addIdToFirstInput = (children: ReactNode, managedHtmlFor: string, describedbyIds: string) => {
  let foundFirstInput = false

  const addId = (targets: ReactNode): ReactNode[] | ReactNode => React.Children.map(targets, (child) => {
      if (foundFirstInput || !React.isValidElement(child)) {
        return child
      }

      const { type } = child

      if (isInputElement(type)) {
        foundFirstInput = true
        return React.cloneElement(child as ReactElement, {
          id: managedHtmlFor,
          'aria-describedby': describedbyIds ? describedbyIds : undefined,
        })
      }

      return React.cloneElement(child, {}, addId(child.props.children))
    })

  return addId(children)
}

/**
 * - CheckBox / RadioButton は内部に label を含むため対象外
 * - SearchInput は label を含むため対象外
 * - InputWithTooltip は領域が狭く FormControl を置けない場所での私用を想定しているため対象外
 *
 * @param type
 * @returns
 */
const isInputElement = (type: string | React.JSXElementConstructor<any>) =>
  type === Input ||
  type === CurrencyInput ||
  type === Textarea ||
  type === DatePicker ||
  type === Select ||
  type === SingleComboBox ||
  type === MultiComboBox ||
  type === InputFile ||
  type === DropZone

const Wrapper = styled(Stack).attrs({
  // 基本的にはすべて 0.5 幅、グルーピングしたフォームコントロール群との余白は ChildrenWrapper で調整する
  gap: 0.5,
})<{ themes: Theme }>`
  ${({ themes: { color } }) => css`
    &[disabled] {
      color: ${color.TEXT_DISABLED};

      /* 個別指定されている色を上書く */
      .smarthr-ui-Heading,
      .smarthr-ui-FormGroup-exampleMessage,
      .smarthr-ui-FormGroup-errorMessage,
      .smarthr-ui-FormGroup-supplementaryMessage,
      .smarthr-ui-RadioButton-label,
      .smarthr-ui-CheckBox-label {
        cursor: revert;
        color: inherit;
      }

      .smarthr-ui-Input {
        border-color: ${color.disableColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
      }

      .smarthr-ui-RadioButton-radioButton,
      .smarthr-ui-CheckBox-checkBox {
        cursor: revert;

        &[checked] + span,
        & + span {
          border-color: ${color.disableColor(color.BORDER)};
          background-color: ${color.disableColor(color.BORDER)};
        }

        &:hover + span {
          box-shadow: none;
        }
      }
    }
  `}
`

const FormLabel = styled(Cluster).attrs({ align: 'center' })`
  /* flex-item が stretch してクリッカブル領域が広がりすぎないようにする */
  align-self: start;
`

const GroupLabel = styled(Text).attrs({ as: 'span' })``

const ErrorMessage = styled.p<{ themes: Theme }>`
  ${({ themes: { color } }) => css`
    .smarthr-ui-FormGroup-errorMessage {
      color: ${color.DANGER};
    }
  `}
`

const ChildrenWrapper = styled.div<{
  innerMargin: Props['innerMargin']
  isRoleGroup: boolean
}>`
  ${({ innerMargin, isRoleGroup }) => css`
    ${(innerMargin || isRoleGroup) &&
    css`
      &&& {
        margin-block-start: ${useSpacing(innerMargin || (isRoleGroup ? 1 : 0.5))};
      }
    `}
  `}
`
