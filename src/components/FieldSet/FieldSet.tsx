import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useId } from '../../hooks/useId'
import { useClassNames } from './useClassNames'

import { Input, Props as InputProps } from '../Input'
import { Heading, HeadingTagTypes, HeadingTypes } from '../Heading'
import { StatusLabel } from '../StatusLabel'
import { FaExclamationCircleIcon } from '../Icon'

type Props = Omit<InputProps, 'error'> & {
  /** ラベル名 */
  label: string
  /** ラベルのタイプ */
  labelType?: HeadingTypes
  /** ラベル名の HTML 要素のタイプ */
  labelTagType?: HeadingTagTypes
  /** input 要素の下に表示するエラーメッセージ */
  errorMessage?: string | string[]
  /** input 要素の下に表示するヘルプメッセージ */
  helpMessage?: string
  /** ラベル部分の末尾に表示する内容 */
  labelSuffix?: ReactNode
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

/**
 * @deprecated The FieldSet component is deprecated, so use FormGroup component instead.
 */
export const FieldSet: VFC<Props & ElementProps> = ({
  label,
  labelType = 'subBlockTitle',
  labelTagType = 'span',
  errorMessage,
  helpMessage,
  className = '',
  labelSuffix,
  children,
  ...props
}) => {
  const theme = useTheme()
  const helpId = useId()
  const classNames = useClassNames()

  return (
    <Wrapper
      $width={props.width || 'auto'}
      className={`${className} ${classNames.wrapper}`}
      aria-describedby={helpMessage ? helpId : undefined}
    >
      <Title themes={theme} className={classNames.title}>
        <TitleText type={labelType} tag={labelTagType} className={classNames.titleText}>
          {label}
        </TitleText>

        {props.required && (
          <StatusLabel type="required" className={classNames.label}>
            必須
          </StatusLabel>
        )}

        {labelSuffix && labelSuffix}
      </Title>

      {children ? (
        children
      ) : (
        <Input {...props} error={!!errorMessage} className={classNames.input} />
      )}

      {errorMessage &&
        (typeof errorMessage === 'string' ? [errorMessage] : errorMessage).map((message) => (
          <Error themes={theme} key={message} className={classNames.error}>
            <ErrorIcon color={theme.color.DANGER} className={classNames.errorIcon} />
            <ErrorText className={classNames.errorText}>{message}</ErrorText>
          </Error>
        ))}

      {helpMessage && (
        <Help id={helpId} themes={theme} className={classNames.help}>
          {helpMessage}
        </Help>
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
const TitleText = styled(Heading)`
  display: inline-block;
`
const Help = styled.div<{ themes: Theme }>`
  ${({ themes: { color, fontSize, spacingByChar } }) => css`
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${fontSize.S};
    line-height: 1;
    color: ${color.TEXT_GREY};
  `}
`
const Error = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize, spacingByChar } }) => css`
    margin: ${spacingByChar(0.5)} 0 0 0;
    font-size: ${fontSize.S};
    line-height: 1;
  `}
`
const ErrorIcon = styled(FaExclamationCircleIcon)`
  margin-right: 0.4rem;
  vertical-align: middle;
`
const ErrorText = styled.span`
  vertical-align: middle;
`
