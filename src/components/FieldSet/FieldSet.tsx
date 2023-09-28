import React, { FC, HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { useId } from '../../hooks/useId'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Heading, HeadingTagTypes, HeadingTypes } from '../Heading'
import { FaExclamationCircleIcon } from '../Icon'
import { Input } from '../Input'
import { StatusLabel } from '../StatusLabel'

import { useClassNames } from './useClassNames'

type Props = Omit<React.ComponentProps<typeof Input>, 'error'> & {
  /** ラベル名 */
  label: ReactNode
  /** ラベルのタイプ */
  labelType?: HeadingTypes
  /** ラベル名の HTML 要素のタイプ */
  labelTagType?: HeadingTagTypes
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
        {/* TODO: レベル自動計算に任せるならtagのデフォルト値をspanにする必要はないかもしれない。検討する */}
        {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
        <LabelHeading type={labelType} tag={labelTagType} className={classNames.titleText}>
          {label}
        </LabelHeading>

        {props.required && (
          <StatusLabel type="red" className={classNames.label}>
            必須
          </StatusLabel>
        )}

        {labelSuffix && labelSuffix}
      </Title>

      {helpMessage && (
        <Help id={helpId} themes={theme} className={classNames.help}>
          {helpMessage}
        </Help>
      )}
      {errorMessage &&
        (Array.isArray(errorMessage) ? errorMessage : [errorMessage]).map((message, index) => (
          <Error themes={theme} key={index} className={classNames.error}>
            <ErrorIcon color={theme.color.DANGER} className={classNames.errorIcon} />
            <ErrorText className={classNames.errorText}>{message}</ErrorText>
          </Error>
        ))}

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
const LabelHeading = styled(Heading)`
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
    margin: ${spacingByChar(0.5)} 0;
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
