import {
  type ComponentType,
  type FC,
  type ReactNode,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { FaCircleExclamationIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { Text, type TextProps } from '../Text'
import { VisuallyHiddenText, visuallyHiddenTextClassName } from '../VisuallyHiddenText'

import type { CommonProps, IconType, ObjectLabelType, StatusLabelType } from './type'

type Props = CommonProps & {
  wrapperRef: RefObject<HTMLDivElement>
  /** グループのラベル名 */
  label: Omit<ObjectLabelType, 'id' | 'htmlFor'> & Required<Pick<ObjectLabelType, 'id' | 'htmlFor'>>
  as?: string | ComponentType<any>
  /** `true` のとき、childrenWrapperの上部余白を広げる（FieldsetがinnerMargin未指定の場合に使用） */
  fieldsetWithDefaultMargin?: boolean
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
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
    label: 'smarthr-ui-FormControl-label',
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

const SMARTHR_UI_INPUT_SELECTOR = '[data-smarthr-ui-input="true"]'
export const CHILDREN_WRAPPER_INPUT_SELECTOR = `.smarthr-ui-FormControl-childrenWrapper ${SMARTHR_UI_INPUT_SELECTOR}`
export const LABEL_TEXT_SELECTOR = '.smarthr-ui-FormControl-labelText'

export const FormGroup: FC<Props> = ({
  wrapperRef,
  label,
  subActionArea,
  innerMargin,
  statusLabels,
  helpMessage,
  exampleMessage,
  errorMessages,
  autoBindErrorInput = true,
  supplementaryMessage,
  as = 'div',
  className,
  children,
  fieldsetWithDefaultMargin,
  ...rest
}) => {
  const managedDescribedbyIdsRef = useRef<string[]>([])
  const isFieldset = as === 'fieldset'

  const actualStatusLabels = useMemo(
    () => (statusLabels ? (Array.isArray(statusLabels) ? statusLabels : [statusLabels]) : []),
    [statusLabels],
  )

  // HINT: memo化している箇所がないため毎回計算している
  const actualErrorMessages = errorMessages
    ? Array.isArray(errorMessages)
      ? errorMessages
      : [errorMessages]
    : []

  const helpMessageId = helpMessage ? `${label.htmlFor}_helpMessage` : undefined
  const exampleMessageId = exampleMessage ? `${label.htmlFor}_exampleMessage` : undefined
  const supplementaryMessageId = supplementaryMessage
    ? `${label.htmlFor}_supplementaryMessage`
    : undefined
  const visibleErrorMessages = actualErrorMessages.length > 0
  const errorMessagesId = visibleErrorMessages ? `${label.htmlFor}_errorMessages` : undefined

  const describedbyIds = useMemo(() => {
    const temp: string[] = []

    if (helpMessageId) {
      temp.push(helpMessageId)
    }
    if (exampleMessageId) {
      temp.push(exampleMessageId)
    }
    if (supplementaryMessageId) {
      temp.push(supplementaryMessageId)
    }
    if (errorMessagesId) {
      temp.push(errorMessagesId)
    }

    return temp.join(' ')
  }, [helpMessageId, exampleMessageId, supplementaryMessageId, errorMessagesId])

  const classNames = useMemo(() => {
    const generators = classNameGenerator()

    return {
      wrapper: generators.wrapper({ className }),
      label: generators.label({
        className: label.unrecommendedHide ? visuallyHiddenTextClassName : '',
      }),
      childrenWrapper: generators.childrenWrapper({ fieldsetWithDefaultMargin }),
    }
  }, [fieldsetWithDefaultMargin, label.unrecommendedHide, className])

  useEffect(() => {
    if (!wrapperRef.current) {
      return
    }

    const input = wrapperRef.current.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (!input) {
      return
    }

    const ariaDescribedBy = input.getAttribute('aria-describedby') || ''
    const currentTokens = ariaDescribedBy ? ariaDescribedBy.split(' ') : []
    // HINT: 自分が過去に付与したid以外（=外部由来のid）だけを残す
    const externalTokens = currentTokens.filter(
      (token) => !managedDescribedbyIdsRef.current.includes(token),
    )
    const describedbyIdTokens = describedbyIds ? describedbyIds.split(' ') : []
    const nextValue = [...externalTokens, ...describedbyIdTokens].join(' ')

    if (nextValue !== ariaDescribedBy) {
      if (nextValue) {
        input.setAttribute('aria-describedby', nextValue)
      } else {
        input.removeAttribute('aria-describedby')
      }
    }

    managedDescribedbyIdsRef.current = describedbyIdTokens
  }, [describedbyIds, wrapperRef])

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
      <LabelCluster
        isFieldset={isFieldset}
        managedHtmlFor={label.htmlFor}
        managedLabelId={label.id}
        unrecommendedHideLabel={label.unrecommendedHide}
        labelType={label.styleType}
        label={label.text}
        labelIcon={label.icon}
        statusLabels={actualStatusLabels}
        subActionArea={subActionArea}
        labelClassName={classNames.label}
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
          {actualErrorMessages.map((message, index) => (
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

const LabelCluster = memo<
  Pick<Props, 'subActionArea'> & {
    label: ReactNode
    labelType: TextProps['styleType']
    labelIcon?: IconType
    unrecommendedHideLabel?: boolean
    isFieldset: boolean
    managedHtmlFor: string
    managedLabelId: string
    labelClassName: string
    statusLabels: StatusLabelType[]
  }
>(
  ({
    isFieldset,
    managedHtmlFor,
    managedLabelId,
    unrecommendedHideLabel,
    labelType = 'blockTitle',
    label,
    labelIcon,
    subActionArea,
    labelClassName,
    statusLabels,
  }) => {
    const body = (
      <>
        <Text styleType={labelType} icon={labelIcon}>
          <span className="smarthr-ui-FormControl-labelText">{label}</span>
        </Text>
        {statusLabels.length > 0 && (
          <Cluster gap={0.25} as="span">
            {statusLabels}
          </Cluster>
        )}
      </>
    )

    const attrs: {
      label: { 'aria-hidden': 'true' } | { as: 'label'; htmlFor: string; id: string } | null
      visuallyHidden: { as: 'legend' | 'label'; htmlFor?: string; id?: string } | null
    } = {
      label: null,
      visuallyHidden: null,
    }

    if (isFieldset) {
      attrs.visuallyHidden = { as: 'legend' }

      if (!unrecommendedHideLabel) {
        attrs.label = { 'aria-hidden': 'true' } as const
      }
    } else {
      attrs[unrecommendedHideLabel ? 'visuallyHidden' : 'label'] = {
        as: 'label',
        htmlFor: managedHtmlFor,
        id: managedLabelId,
      }
    }

    return (
      <>
        {attrs.visuallyHidden && (
          <VisuallyHiddenText {...attrs.visuallyHidden}>{body}</VisuallyHiddenText>
        )}
        {attrs.label && (
          <Cluster justify="space-between">
            <Cluster {...attrs.label} align="center" className={labelClassName}>
              {body}
            </Cluster>
            {subActionArea && <div className="shr-grow">{subActionArea}</div>}
          </Cluster>
        )}
      </>
    )
  },
)
