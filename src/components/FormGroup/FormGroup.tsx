import React, { ComponentProps, HTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
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
}>
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-labelledby'>

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
  className = '',
  children,
  ...props
}) => {
  const disabledClass = disabled ? 'disabled' : ''
  const managedLabelId = useId(labelId)
  const isRoleGroup = props.role === 'group'
  const statusLabelList = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps]

  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper
      {...props}
      disabled={disabled}
      aria-labelledby={isRoleGroup ? managedLabelId : undefined}
      themes={theme}
      className={`${className} ${disabledClass} ${classNames.wrapper}`}
      as={isRoleGroup ? 'fieldset' : 'div'}
    >
      <Cluster
        align="center"
        htmlFor={htmlFor}
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

      {helpMessage && <p className={classNames.helpMessage}>{helpMessage}</p>}

      {errorMessages && (
        <Stack gap={0}>
          {(Array.isArray(errorMessages) ? errorMessages : [errorMessages]).map(
            (message, index) => (
              <ErrorMessage themes={theme} key={index}>
                <FaExclamationCircleIcon text={message} className={classNames.errorMessage} />
              </ErrorMessage>
            ),
          )}
        </Stack>
      )}

      <ChildrenWrapper innerMargin={innerMargin} isRoleGroup={isRoleGroup} themes={theme}>
        {children}
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
      .smarthr-ui-FormGroup-errorMessage {
        color: inherit;
      }

      .smarthr-ui-Input {
        border-color: ${color.disableColor(color.BORDER)};
        background-color: ${color.hoverColor(color.WHITE)};
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
  themes: Theme
}>`
  ${({ innerMargin, isRoleGroup, themes: { space } }) => css`
    ${(innerMargin || isRoleGroup) &&
    css`
      &&& {
        margin-block-start: ${space(innerMargin || isRoleGroup ? 1 : 0.5)};
      }
    `}
  `}
`
