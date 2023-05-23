import React, {
  ComponentProps,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { useSpacing } from '../../hooks/useSpacing'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Heading, HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { StatusLabel } from '../StatusLabel'

import { useClassNames } from './useClassNames'

import type { Gap } from '../Layout'
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
  /** タイトルの下に表示するエラーメッセージ */
  errorMessages?: ReactNode | ReactNode[]
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
  errorMessages,
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
  const describedbyIds = `${managedHtmlFor}_helpMessage ${managedHtmlFor}_errorMessage`

  return (
    <Wrapper
      {...props}
      disabled={disabled}
      aria-labelledby={isRoleGroup ? managedLabelId : undefined}
      aria-describedby={isRoleGroup ? describedbyIds : undefined}
      themes={theme}
      className={`${className} ${disabledClass} ${classNames.wrapper}`}
      as={as}
    >
      <Cluster
        align="center"
        htmlFor={managedHtmlFor}
        id={managedLabelId}
        className={`${classNames.label}`}
        as={isRoleGroup ? 'legend' : 'label'}
      >
        <GroupLabel type={titleType}>{title}</GroupLabel>
        {statusLabelList.length > 0 && (
          <Cluster gap={0.25} as="span">
            {statusLabelList.map((statusLabelProp, index) => (
              <StatusLabel {...statusLabelProp} key={index} />
            ))}
          </Cluster>
        )}
      </Cluster>

      {helpMessage && (
        <p className={classNames.helpMessage} id={`${managedHtmlFor}_helpMessage`}>
          {helpMessage}
        </p>
      )}

      {errorMessages && (
        <Stack gap={0} id={`${managedHtmlFor}_errorMessage`}>
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
        {React.Children.map(children, (child, i) => {
          // id があるので、最初の要素以外には付与しない
          if (!React.isValidElement(child) || i > 0) {
            return child
          }

          return React.cloneElement(child as ReactElement, {
            id: managedHtmlFor,
            'aria-describedby': describedbyIds,
          })
        })}
      </ChildrenWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(Stack).attrs({
  // 基本的にはすべて 0.5 幅、グルーピングしたフォームコントロール群との余白は ChildrenWrapper で調整する
  gap: 0.5,
  // flex-item が stretch してクリッカブル領域が広がりすぎないようにする
  align: 'flex-start',
})<{ themes: Theme }>`
  ${({ themes: { color } }) => css`
    &[disabled] {
      color: ${color.TEXT_DISABLED};

      /* 個別指定されている色を上書く */
      .smarthr-ui-Heading,
      .smarthr-ui-FormGroup-errorMessage,
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

const GroupLabel = styled(Heading).attrs({ tag: 'span' })``

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
