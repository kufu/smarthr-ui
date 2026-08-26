import { type ComponentType, type FC, type RefObject, useEffect, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { FaCircleExclamationIcon } from '../Icon'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'
import { useDescribedByIds } from './useDescribedByIds'

import type { CommonProps, LabelComponentProps, ObjectLabelType } from './type'

type Props = CommonProps & {
  wrapperRef: RefObject<HTMLDivElement>
  /** グループのラベル名 */
  label: Omit<ObjectLabelType, 'id' | 'htmlFor'> & Required<Pick<ObjectLabelType, 'id' | 'htmlFor'>>
  as?: string | ComponentType<any>
  /** `true` のとき、childrenWrapperの上部余白を広げる（FieldsetがinnerMargin未指定の場合に使用） */
  fieldsetWithDefaultMargin?: boolean
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
  LabelComponent: FC<LabelComponentProps>
}

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-FormControl',
      'shr-mx-[unset] shr-border-none shr-p-[unset]',
      'disabled:shr-text-disabled',
      '[&:disabled_.smarthr-ui-FormControl-label_>_span]:shr-text-disabled',
      '[&:disabled_.smarthr-ui-FormControl-exampleMessage]:shr-text-color-inherit',
      '[&:disabled_.smarthr-ui-FormControl-errorMessage-Icon]:shr-text-color-inherit',
      '[&:disabled_.smarthr-ui-FormControl-supplementaryMessage]:shr-text-color-inherit',
      '[&:disabled_.smarthr-ui-Input]:shr-border-default/50 [&:disabled_.smarthr-ui-Input]:shr-bg-white-darken',
    ],
    childrenWrapper: 'smarthr-ui-FormControl-childrenWrapper',
  },
  variants: {
    // TODO: innerMarginが未指定、初期値の場合、かつFieldsetの場合、childrenの上部の余白を広げることで
    // FormControltとの差をわかりやすくしている
    // 微妙な方法ではあるので、必要に応じてinnerMarginではない属性を用意する
    // https://kufuinc.slack.com/archives/CGC58MW01/p1737944965871159?thread_ts=1737541173.404369&cid=CGC58MW01
    fieldsetWithDefaultMargin: {
      true: {
        childrenWrapper: '[:not([hidden])_~_&&&]:shr-mt-0.5',
      },
    },
  },
})

export const FormGroup: FC<Props> = ({
  wrapperRef,
  label,
  subActionArea,
  innerMargin,
  statusLabels,
  helpMessage,
  exampleMessage,
  errorMessages: orgErrorMessages,
  autoBindErrorInput = true,
  supplementaryMessage,
  as = 'div',
  className,
  children,
  fieldsetWithDefaultMargin,
  LabelComponent,
  ...rest
}) => {
  const isFieldset = as === 'fieldset'

  const classNames = useMemo(() => {
    const generators = classNameGenerator()

    return {
      wrapper: generators.wrapper({ className }),
      childrenWrapper: generators.childrenWrapper({ fieldsetWithDefaultMargin }),
    }
  }, [fieldsetWithDefaultMargin, className])

  // HINT: statusLabelsは設定されない場合が大半、かつ設定されてもRequiredLabelでmemo化されているため
  // memo化がかなりの確率で有用
  const actualStatusLabels = useMemo(
    () => (statusLabels ? (Array.isArray(statusLabels) ? statusLabels : [statusLabels]) : []),
    [statusLabels],
  )

  const {
    errorMessages,
    visibleErrorMessages,
    helpMessageId,
    exampleMessageId,
    supplementaryMessageId,
    errorMessagesId,
    describedbyIds,
  } = useDescribedByIds({
    wrapperRef,
    htmlFor: label.htmlFor,
    errorMessages: orgErrorMessages,
    helpMessage,
    exampleMessage,
    supplementaryMessage,
  })

  useEffect(() => {
    if (!autoBindErrorInput || !wrapperRef.current) {
      return
    }

    const input = wrapperRef.current.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (input) {
      if (visibleErrorMessages) {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    }
  }, [visibleErrorMessages, autoBindErrorInput, wrapperRef])

  return (
    <Stack
      {...rest}
      ref={wrapperRef}
      as={as}
      gap={innerMargin ?? 0.5}
      aria-describedby={isFieldset && describedbyIds ? describedbyIds : undefined}
      className={classNames.wrapper}
    >
      <LabelComponent
        managedHtmlFor={label.htmlFor}
        managedLabelId={label.id}
        unrecommendedHideLabel={label.unrecommendedHide}
        labelType={label.styleType}
        label={label.text}
        labelIcon={label.icon}
        statusLabels={actualStatusLabels}
        subActionArea={subActionArea}
      />
      {helpMessage && (
        <p className="smarthr-ui-FormControl-helpMessage" id={helpMessageId}>
          {helpMessage}
        </p>
      )}
      {exampleMessage && (
        <Text
          as="p"
          color="TEXT_GREY"
          italic
          id={exampleMessageId}
          className="smarthr-ui-FormControl-exampleMessage"
        >
          {exampleMessage}
        </Text>
      )}
      {visibleErrorMessages && (
        <div id={errorMessagesId} className="shr-list-none" role="alert">
          {errorMessages.map((message, index) => (
            <p key={index}>
              <Text
                className="smarthr-ui-FormControl-errorMessage"
                icon={
                  <FaCircleExclamationIcon className="smarthr-ui-FormControl-errorMessage-Icon shr-text-danger" />
                }
              >
                {message}
              </Text>
            </p>
          ))}
        </div>
      )}
      <div className={classNames.childrenWrapper}>{children}</div>
      {supplementaryMessage && (
        <Text
          as="p"
          size="S"
          color="TEXT_GREY"
          id={supplementaryMessageId}
          className="smarthr-ui-FormControl-supplementaryMessage"
        >
          {supplementaryMessage}
        </Text>
      )}
    </Stack>
  )
}
