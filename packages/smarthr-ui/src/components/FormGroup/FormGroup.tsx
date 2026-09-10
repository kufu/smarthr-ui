'use client'

import {
  type ComponentProps,
  type ComponentType,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  type Ref,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { useMergeRefs } from '../../hooks/client/useMergeRefs'
import { FaCircleExclamationIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { Text } from '../Text'

import { CHILDREN_WRAPPER_INPUT_SELECTOR } from './constants'

import type { CommonProps, LabelComponentProps, ObjectLabelType } from './type'

const autoBindErrorCallbackRef = (node: HTMLElement | null) => {
  if (!node) {
    return
  }

  const action = () => {
    const bindErrorAttr = node.getAttribute('data-auto-bind-error-input')

    // HINT: そもそも属性がない場合、入力要素にaria-invalid属性を自動的にon/offする処理をしない
    if (!bindErrorAttr) {
      return
    }

    const input = node.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

    if (input) {
      if (bindErrorAttr === 'true') {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    }
  }

  action()

  const observer = new MutationObserver(action)
  observer.observe(node, {
    attributes: true,
    attributeFilter: ['data-auto-bind-error-input'],
  })

  return () => {
    observer.disconnect()
  }
}

type Props = Omit<CommonProps, 'className'> & {
  callbackRef: Ref<HTMLElement>
  /** グループのラベル名 */
  label: Omit<ObjectLabelType, 'id' | 'htmlFor'> & Required<Pick<ObjectLabelType, 'id' | 'htmlFor'>>
  as?: string | ComponentType<any>
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
  LabelComponent: FC<LabelComponentProps>
  classNames: {
    wrapper: string
    childrenWrapper: string
  }
}

// HINT: errorMessagesの利用方法とReactNodeのためuseMemoでは適切にmemo化しにくい
// undefined、もしくは空配列の場合は定数のEMPTY_ERROR_MESSAGESと差し替えることで安定化する
const EMPTY_ERROR_MESSAGES: ReactNode[] = []

export const FormGroup: FC<Props> = ({
  callbackRef,
  label,
  subActionArea,
  innerMargin,
  statusLabels,
  helpMessage,
  exampleMessage,
  errorMessages: orgErrorMessages,
  supplementaryMessage,
  as = 'div',
  children,
  classNames,
  LabelComponent,
  autoBindErrorInput = true,
  ...rest
}) => {
  // HINT: statusLabelsは設定されない場合が大半、かつ設定されてもRequiredLabelでmemo化されているため
  // memo化がかなりの確率で有用
  const actualStatusLabels = useMemo(
    () => (statusLabels ? (Array.isArray(statusLabels) ? statusLabels : [statusLabels]) : []),
    [statusLabels],
  )

  const wrapperRef = useRef<HTMLDivElement>(null)

  // HINT: errorMessagesの利用方法とReactNodeのためuseMemoでは適切にmemo化しにくい
  // undefined、もしくは空配列の場合は定数のEMPTY_ERROR_MESSAGESと差し替えることで安定化する
  const errorMessages = orgErrorMessages
    ? Array.isArray(orgErrorMessages)
      ? orgErrorMessages.length === 0
        ? EMPTY_ERROR_MESSAGES
        : orgErrorMessages
      : [orgErrorMessages]
    : EMPTY_ERROR_MESSAGES

  const helpMessageId = helpMessage ? `${label.htmlFor}_helpMessage` : undefined
  const exampleMessageId = exampleMessage ? `${label.htmlFor}_exampleMessage` : undefined
  const supplementaryMessageId = supplementaryMessage
    ? `${label.htmlFor}_supplementaryMessage`
    : undefined
  const visibleErrorMessages = errorMessages.length > 0
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

  const managedDescribedbyIdsRef = useRef<string[]>([])

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

  const wrapperCallbackRef = useMergeRefs(
    wrapperRef,
    callbackRef,
    autoBindErrorInput ? autoBindErrorCallbackRef : undefined,
  )

  return (
    <Stack
      {...rest}
      as={as}
      ref={wrapperCallbackRef}
      gap={innerMargin ?? 0.5}
      className={classNames.wrapper}
      aria-describedby={as === 'fieldset' ? describedbyIds || undefined : undefined}
      data-auto-bind-error-input={autoBindErrorInput ? visibleErrorMessages.toString() : undefined}
    >
      <LabelComponent
        managedLabelId={label.id}
        managedHtmlFor={label.htmlFor}
        unrecommendedHideLabel={label.unrecommendedHide}
        labelType={label.styleType}
        labelIcon={label.icon}
        statusLabels={actualStatusLabels}
        label={label.text}
        subActionArea={subActionArea}
      />
      {helpMessage && (
        <p id={helpMessageId} className="smarthr-ui-FormControl-helpMessage">
          {helpMessage}
        </p>
      )}
      {exampleMessage && (
        <Text
          as="p"
          id={exampleMessageId}
          italic
          color="TEXT_GREY"
          className="smarthr-ui-FormControl-exampleMessage"
        >
          {exampleMessage}
        </Text>
      )}
      {visibleErrorMessages && (
        <div role="alert" id={errorMessagesId} className="shr-list-none">
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
          id={supplementaryMessageId}
          size="S"
          color="TEXT_GREY"
          className="smarthr-ui-FormControl-supplementaryMessage"
        >
          {supplementaryMessage}
        </Text>
      )}
    </Stack>
  )
}

export const LabelBody: FC<
  Pick<ComponentProps<typeof Text>, 'styleType' | 'icon' | 'children'> &
    Pick<LabelComponentProps, 'statusLabels'>
> = ({ styleType, icon, children, statusLabels }) => (
  <>
    <Text styleType={styleType} icon={icon}>
      <span className="smarthr-ui-FormControl-labelText">{children}</span>
    </Text>
    {statusLabels.length > 0 && (
      <Cluster as="span" gap={0.25}>
        {statusLabels}
      </Cluster>
    )}
  </>
)

export const LabelCluster: FC<
  PropsWithChildren<{ as?: 'label'; htmlFor?: string; id?: string; 'aria-hidden'?: 'true' }>
> = ({ children, ...rest }) => (
  <Cluster {...rest} align="center" className="smarthr-ui-FormControl-label">
    {children}
  </Cluster>
)
