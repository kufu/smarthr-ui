import React, { type ComponentPropsWithoutRef } from 'react'

import {
  ErrorMessageList,
  ExampleMessageText,
  HelpMessageParagraph,
  type Props,
  SupplementaryMessageText,
  TitleCluster,
  childrenWrapper,
  formGroup,
  useFormControl,
} from '../FormControl'
import { Stack } from '../Layout'

type ElementProps = Omit<ComponentPropsWithoutRef<'fieldset'>, keyof Props | 'aria-labelledby'>

export const Fieldset: React.FC<Props & ElementProps> = ({
  title,
  titleType = 'blockTitle',
  dangerouslyTitleHidden = false,
  htmlFor,
  labelId,
  innerMargin,
  statusLabelProps = [],
  helpMessage,
  exampleMessage,
  errorMessages,
  autoBindErrorInput = true,
  supplementaryMessage,
  className,
  children,
  ...props
}) => {
  const {
    managedHtmlFor,
    managedLabelId,
    inputWrapperRef,
    statusLabelList,
    describedbyIds,
    actualErrorMessages,
    styles: { wrapperStyle, labelStyle, errorListStyle, errorIconStyle, childrenWrapperStyle },
  } = useFormControl({
    htmlFor,
    labelId,
    statusLabelProps,
    helpMessage,
    exampleMessage,
    supplementaryMessage,
    errorMessages,
    autoBindErrorInput,
    className,
    innerMargin,
    dangerouslyTitleHidden,
  })

  return (
    <Stack
      {...props}
      as="fieldset"
      gap={innerMargin ?? 0.5}
      aria-labelledby={managedLabelId}
      aria-describedby={describedbyIds || undefined}
      className={wrapperStyle}
    >
      <TitleCluster
        as="legend"
        managedLabelId={managedLabelId}
        labelStyle={labelStyle}
        dangerouslyTitleHidden={dangerouslyTitleHidden}
        titleType={titleType}
        title={title}
        statusLabelList={statusLabelList}
      />
      <HelpMessageParagraph helpMessage={helpMessage} managedHtmlFor={managedHtmlFor} />
      <ExampleMessageText exampleMessage={exampleMessage} managedHtmlFor={managedHtmlFor} />
      <ErrorMessageList
        errorMessages={actualErrorMessages}
        managedHtmlFor={managedHtmlFor}
        errorListStyle={errorListStyle}
        errorIconStyle={errorIconStyle}
      />
      <div className={childrenWrapperStyle} ref={inputWrapperRef}>
        {children}
      </div>
      <SupplementaryMessageText
        supplementaryMessage={supplementaryMessage}
        managedHtmlFor={managedHtmlFor}
      />
    </Stack>
  )
}
