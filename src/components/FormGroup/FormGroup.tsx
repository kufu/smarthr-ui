import React, {
  ComponentProps,
  HTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react'
import styled from 'styled-components'

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
  /** タイトルと子要素の間のマージン */
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
  const managedHtmlFor = useId(htmlFor)
  const managedLabelId = useId(labelId)
  const isRoleGroup = props.role === 'group'
  const statusLabelList = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps]

  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper
      {...props}
      gap={innerMargin || isRoleGroup ? 1 : 0.5}
      aria-labelledby={isRoleGroup ? managedLabelId : undefined}
      aria-describedby={
        isRoleGroup ? `${managedHtmlFor}_helpMessage ${managedHtmlFor}_errorMessage` : undefined
      }
      themes={theme}
      className={`${className} ${disabledClass} ${classNames.wrapper}`}
    >
      <Stack gap={0.5}>
        <Cluster
          align="center"
          htmlFor={managedHtmlFor}
          id={managedLabelId}
          className={`${classNames.label}`}
          as="label"
        >
          <GroupLabel tag="span" type={titleType}>
            {title}
          </GroupLabel>
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
                <p key={index}>
                  <FaExclamationCircleIcon
                    color={disabled ? 'TEXT_DISABLED' : 'DANGER'}
                    text={message}
                    className={classNames.errorMessage}
                  />
                </p>
              ),
            )}
          </Stack>
        )}
      </Stack>

      {React.Children.map(children, (child, i) => {
        // id があるので、最初の要素以外には付与しない
        if (!React.isValidElement(child) || i > 0) {
          return child
        }

        return React.cloneElement(child as ReactElement, {
          id: managedHtmlFor,
          disabled,
          'aria-describedby': `${managedHtmlFor}_helpMessage ${managedHtmlFor}_errorMessage`,
        })
      })}
    </Wrapper>
  )
}

const Wrapper = styled(Stack)<{ themes: Theme }>`
  &.disabled {
    color: ${({ themes }) => themes.color.TEXT_DISABLED};
  }
`

const GroupLabel = styled(Heading)`
  .disabled & {
    color: inherit;
  }
`
