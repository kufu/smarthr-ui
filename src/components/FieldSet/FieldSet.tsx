import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'
import { Input } from '../Input'
import { Stack } from '../Layout/Stack'
import { StatusLabel } from '../StatusLabel'
import { Text } from '../Text'

import { useClassNames } from './useClassNames'

type Props = Omit<React.ComponentProps<typeof Input>, 'error'> & {
  /** ラベル名 */
  label: ReactNode
  /** ラベルのタイプ */
  labelType?: HeadingTypes
  /** input 要素の下に表示するエラーメッセージ */
  errorMessage?: ReactNode | ReactNode[]
  /** input 要素の下に表示するヘルプメッセージ */
  helpMessage?: ReactNode
  /** ラベル部分の末尾に表示する内容 */
  labelSuffix?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

/**
 * @deprecated `Fieldset` コンポーネントは非推奨です。代わりに `FormControl` を使ってください。
 */
export const FieldSet: FC<Props & ElementProps> = ({
  label,
  labelType = 'subBlockTitle',
  errorMessage,
  helpMessage,
  className = '',
  labelSuffix,
  children,
  ...props
}) => {
  const theme = useTheme()
  const managedHtmlFor = useId()
  const helpId = useId()
  const classNames = useClassNames()

  return (
    <Wrapper
      $width={props.width || 'auto'}
      className={`${className} ${classNames.wrapper}`}
      aria-describedby={helpMessage ? helpId : undefined}
    >
      <Title themes={theme} className={classNames.title}>
        <LabelText styleType={labelType} className={classNames.titleText}>
          {label}
        </LabelText>

        {props.required && (
          <StatusLabel type="red" className={classNames.label}>
            必須
          </StatusLabel>
        )}

        {labelSuffix && labelSuffix}
      </Title>

      {helpMessage && (
        <HelpMessage themes={theme} id={helpId} className={classNames.help}>
          {helpMessage}
        </HelpMessage>
      )}
      {errorMessage && (
        <StyledStack themes={theme} gap={0} id={`${managedHtmlFor}_errorMessages`}>
          {(Array.isArray(errorMessage) ? errorMessage : [errorMessage]).map((message, index) => (
            <ErrorMessage themes={theme} key={index} className={classNames.error}>
              <FaExclamationCircleIcon text={message} className={classNames.errorText} />
            </ErrorMessage>
          ))}
        </StyledStack>
      )}

      {children ? (
        children
      ) : (
        // eslint-disable-next-line smarthr/a11y-input-has-name-attribute
        <Input {...props} error={!!errorMessage} className={classNames.input} />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ $width: string | number }>`
  ${({ $width }) => css`
    display: inline-block;
    width: ${typeof $width === 'number' ? `${$width}px` : $width};
  `}
`
const Title = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    display: flex;
    align-items: center;
    margin: 0 0 ${spacingByChar(0.5)};

    > *:not(:first-child) {
      margin-left: ${spacingByChar(0.5)};
    }
  `}
`
const LabelText = styled(Text)`
  display: inline-block;
`

const HelpMessage = styled.p<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    margin-bottom: ${spacingByChar(0.5)};
  `}
`
const StyledStack = styled(Stack)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    margin-bottom: ${spacingByChar(0.5)};
  `}
`

const ErrorMessage = styled.p<{ themes: Theme }>`
  ${({ themes: { color } }) => css`
    .smarthr-ui-FieldSet-errorText {
      color: ${color.DANGER};
    }
  `}
`
