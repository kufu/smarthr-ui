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
  ...rest
}) => {
  const managedDescribedbyIdsRef = useRef<string[]>([])
  const isFieldset = as === 'fieldset'

  const describedbyIds = useMemo(() => {
    const temp: string[] = []

    if (helpMessage) {
      temp.push(`${label.htmlFor}_helpMessage`)
    }
    if (exampleMessage) {
      temp.push(`${label.htmlFor}_exampleMessage`)
    }
    if (supplementaryMessage) {
      temp.push(`${label.htmlFor}_supplementaryMessage`)
    }
    if (errorMessages) {
      temp.push(`${label.htmlFor}_errorMessages`)
    }

    return temp.join(' ')
    // TODO: ReactNodeやarrayなど不安定な値をそのまま依存配列に含めているので調整する
  }, [helpMessage, exampleMessage, supplementaryMessage, errorMessages, label.htmlFor])

  const actualStatusLabels = useMemo(
    () => (statusLabels ? (Array.isArray(statusLabels) ? statusLabels : [statusLabels]) : []),
    [statusLabels],
  )

  const actualErrorMessages = useMemo(() => {
    if (!errorMessages) {
      return []
    }

    return Array.isArray(errorMessages) ? errorMessages : [errorMessages]
  }, [errorMessages])

  const classNames = useMemo(() => {
    const generators = classNameGenerator()

    return {
      wrapper: generators.wrapper({ className }),
      label: generators.label({
        className: label.unrecommendedHide ? visuallyHiddenTextClassName : '',
      }),
      childrenWrapper: generators.childrenWrapper({
        fieldsetWithDefaultMargin: isFieldset && innerMargin === undefined,
      }),
    }
  }, [innerMargin, isFieldset, label.unrecommendedHide, className])

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
      if (actualErrorMessages.length > 0) {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    }
  }, [actualErrorMessages.length, autoBindErrorInput, wrapperRef])

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
      <HelpMessageParagraph helpMessage={helpMessage} managedHtmlFor={label.htmlFor} />
      <ExampleMessageText exampleMessage={exampleMessage} managedHtmlFor={label.htmlFor} />
      <ErrorMessageList errorMessages={actualErrorMessages} managedHtmlFor={label.htmlFor} />
      <div className={classNames.childrenWrapper}>{children}</div>
      <SupplementaryMessageText
        supplementaryMessage={supplementaryMessage}
        managedHtmlFor={label.htmlFor}
      />
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
        <StatusLabelCluster statusLabels={statusLabels} />
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

const StatusLabelCluster = memo<{ statusLabels: StatusLabelType[] }>(({ statusLabels }) =>
  statusLabels.length === 0 ? null : (
    <Cluster gap={0.25} as="span">
      {statusLabels}
    </Cluster>
  ),
)

const HelpMessageParagraph = memo<Pick<Props, 'helpMessage'> & { managedHtmlFor: string }>(
  ({ helpMessage, managedHtmlFor }) =>
    helpMessage ? (
      <p className="smarthr-ui-FormControl-helpMessage" id={`${managedHtmlFor}_helpMessage`}>
        {helpMessage}
      </p>
    ) : null,
)

const ExampleMessageText = memo<Pick<Props, 'exampleMessage'> & { managedHtmlFor: string }>(
  ({ exampleMessage, managedHtmlFor }) =>
    exampleMessage ? (
      <Text
        as="p"
        color="TEXT_GREY"
        italic
        id={`${managedHtmlFor}_exampleMessage`}
        className="smarthr-ui-FormControl-exampleMessage"
      >
        {exampleMessage}
      </Text>
    ) : null,
)

const ErrorMessageList = memo<{
  errorMessages: ReactNode[]
  managedHtmlFor: string
}>(({ errorMessages, managedHtmlFor }) =>
  errorMessages.length > 0 ? (
    <div id={`${managedHtmlFor}_errorMessages`} className="shr-list-none" role="alert">
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
  ) : null,
)

const SupplementaryMessageText = memo<
  Pick<Props, 'supplementaryMessage'> & { managedHtmlFor: string }
>(({ supplementaryMessage, managedHtmlFor }) =>
  supplementaryMessage ? (
    <Text
      as="p"
      size="S"
      color="TEXT_GREY"
      id={`${managedHtmlFor}_supplementaryMessage`}
      className="smarthr-ui-FormControl-supplementaryMessage"
    >
      {supplementaryMessage}
    </Text>
  ) : null,
)
