'use client'

import React, {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useId } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { FaCircleExclamationIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { StatusLabel } from '../StatusLabel'
import { Text, TextProps } from '../Text'
import { VisuallyHiddenText, visuallyHiddenText } from '../VisuallyHiddenText'

import type { Gap } from '../../types'

type StatusLabelProps = ComponentProps<typeof StatusLabel>

type Props = PropsWithChildren<{
  /** グループのタイトル名 */
  title: ReactNode
  /** タイトルの見出しのタイプ */
  titleType?: TextProps['styleType']
  /** タイトル右の領域 */
  subActionArea?: ReactNode
  /** タイトルの見出しを視覚的に隠すかどうか */
  dangerouslyTitleHidden?: boolean
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
  /** タイトルの下に表示する入力例 */
  exampleMessage?: ReactNode
  /** タイトルの下に表示するエラーメッセージ */
  errorMessages?: ReactNode | ReactNode[]
  /** エラーがある場合に自動的に入力要素を error にするかどうか */
  autoBindErrorInput?: boolean
  /** フォームコントロールの下に表示する補足メッセージ */
  supplementaryMessage?: ReactNode
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
  as?: string | React.ComponentType<any>
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props | 'aria-labelledby'>

const formGroup = tv({
  slots: {
    wrapper: [
      'smarthr-ui-FormControl',
      'shr-mx-[unset] shr-border-none shr-p-[unset]',
      'disabled:shr-text-disabled',
      '[&:disabled_.smarthr-ui-FormControl-label_>_span]:shr-text-disabled',
      '[&:disabled_.smarthr-ui-FormControl-exampleMessage]:shr-text-color-inherit',
      '[&:disabled_.smarthr-ui-FormControl-errorMessage]:shr-text-color-inherit',
      '[&:disabled_.smarthr-ui-FormControl-supplementaryMessage]:shr-text-color-inherit',
      '[&:disabled_.smarthr-ui-Input]:shr-border-default/50 [&:disabled_.smarthr-ui-Input]:shr-bg-white-darken',
    ],
    label: ['smarthr-ui-FormControl-label'],
    errorList: ['shr-list-none'],
    errorIcon: ['smarthr-ui-FormControl-errorMessage', 'shr-text-danger'],
  },
})

const SMARTHR_UI_INPUT_SELECTOR = '[data-smarthr-ui-input="true"]'

export const ActualFormControl: React.FC<Props & ElementProps> = ({
  title,
  titleType = 'blockTitle',
  subActionArea,
  dangerouslyTitleHidden = false,
  htmlFor,
  labelId,
  innerMargin = 0.5,
  statusLabelProps,
  helpMessage,
  exampleMessage,
  errorMessages,
  autoBindErrorInput = true,
  supplementaryMessage,
  as = 'div',
  className,
  children,
  ...props
}) => {
  const defaultHtmlFor = useId()
  const defaultLabelId = useId()
  const managedHtmlFor = htmlFor || defaultHtmlFor
  const managedLabelId = labelId || defaultLabelId
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const isFieldset = as === 'fieldset'

  const describedbyIds = useMemo(() => {
    const temp = []

    if (helpMessage) {
      temp.push(`${managedHtmlFor}_helpMessage`)
    }
    if (exampleMessage) {
      temp.push(`${managedHtmlFor}_exampleMessage`)
    }
    if (supplementaryMessage) {
      temp.push(`${managedHtmlFor}_supplementaryMessage`)
    }
    if (errorMessages) {
      temp.push(`${managedHtmlFor}_errorMessages`)
    }

    return temp.join(' ')
  }, [helpMessage, exampleMessage, supplementaryMessage, errorMessages, managedHtmlFor])
  const statusLabelList = useMemo(() => {
    if (!statusLabelProps) {
      return []
    }

    return Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps]
  }, [statusLabelProps])
  const actualErrorMessages = useMemo(() => {
    if (!errorMessages) {
      return []
    }

    return Array.isArray(errorMessages) ? errorMessages : [errorMessages]
  }, [errorMessages])

  const { wrapperStyle, labelStyle, errorListStyle, errorIconStyle } = useMemo(() => {
    const { wrapper, label, errorList, errorIcon } = formGroup()

    return {
      wrapperStyle: wrapper({ className }),
      labelStyle: label({ className: dangerouslyTitleHidden ? visuallyHiddenText() : '' }),
      errorListStyle: errorList(),
      errorIconStyle: errorIcon(),
    }
  }, [dangerouslyTitleHidden, className])

  useEffect(() => {
    if (isFieldset) {
      return
    }

    const inputWrapper = inputWrapperRef?.current

    if (!inputWrapper) {
      return
    }

    // HINT: 対象idを持つ要素が既に存在する場合、何もしない
    if (document.getElementById(managedHtmlFor)) {
      return
    }

    const input = inputWrapper.querySelector(SMARTHR_UI_INPUT_SELECTOR)

    if (!input) {
      return
    }

    if (!input.getAttribute('id')) {
      input.setAttribute('id', managedHtmlFor)
    }

    if (input instanceof HTMLInputElement && input.type === 'file') {
      const attrName = 'aria-labelledby'
      const inputLabelledByIds = input.getAttribute(attrName)

      if (inputLabelledByIds) {
        // InputFileの場合はlabel要素の可視ラベルをアクセシブルネームに含める
        input.setAttribute(attrName, `${inputLabelledByIds} ${managedLabelId}`)
      }
    } else if (dangerouslyTitleHidden) {
      const attrName = 'aria-labelledby'
      const inputLabelledByIds = input.getAttribute(attrName)

      if (!inputLabelledByIds?.match(managedLabelId)) {
        input.setAttribute(
          attrName,
          inputLabelledByIds ? `${managedLabelId} ${inputLabelledByIds}` : managedLabelId,
        )
      }
    }
  }, [managedHtmlFor, isFieldset, dangerouslyTitleHidden, managedLabelId])
  useEffect(() => {
    if (!describedbyIds) {
      return
    }

    const attrName = 'aria-describedby'
    const inputWrapper = inputWrapperRef?.current

    if (!inputWrapper || inputWrapper.querySelector(`[${attrName}="${describedbyIds}"]`)) {
      return
    }

    const input = inputWrapper.querySelector(SMARTHR_UI_INPUT_SELECTOR)

    if (input && !input.getAttribute(attrName)) {
      input.setAttribute(attrName, describedbyIds)
    }
  }, [describedbyIds])
  useEffect(() => {
    if (!autoBindErrorInput) {
      return
    }

    const inputWrapper = inputWrapperRef?.current

    if (!inputWrapper) {
      return
    }

    const input = inputWrapper.querySelector(SMARTHR_UI_INPUT_SELECTOR)

    if (input) {
      const attrName = 'aria-invalid'

      if (actualErrorMessages.length > 0) {
        input.setAttribute(attrName, 'true')
      } else {
        input.removeAttribute(attrName)
      }
    }
  }, [actualErrorMessages.length, autoBindErrorInput])

  return (
    <Stack
      {...props}
      as={as}
      gap={innerMargin}
      aria-labelledby={isFieldset ? managedLabelId : undefined}
      aria-describedby={isFieldset && describedbyIds ? describedbyIds : undefined}
      className={wrapperStyle}
    >
      <TitleCluster
        isFieldset={isFieldset}
        managedHtmlFor={managedHtmlFor}
        managedLabelId={managedLabelId}
        labelStyle={labelStyle}
        dangerouslyTitleHidden={dangerouslyTitleHidden}
        titleType={titleType}
        title={title}
        statusLabelList={statusLabelList}
        subActionArea={subActionArea}
      />
      <HelpMessageParagraph helpMessage={helpMessage} managedHtmlFor={managedHtmlFor} />
      <ExampleMessageText exampleMessage={exampleMessage} managedHtmlFor={managedHtmlFor} />
      <ErrorMessageList
        errorMessages={actualErrorMessages}
        managedHtmlFor={managedHtmlFor}
        errorListStyle={errorListStyle}
        errorIconStyle={errorIconStyle}
      />
      <div ref={inputWrapperRef}>{children}</div>
      <SupplementaryMessageText
        supplementaryMessage={supplementaryMessage}
        managedHtmlFor={managedHtmlFor}
      />
    </Stack>
  )
}

const TitleCluster = React.memo<
  Pick<Props, 'dangerouslyTitleHidden' | 'title' | 'subActionArea'> & {
    titleType: TextProps['styleType']
    statusLabelList: StatusLabelProps[]
    isFieldset: boolean
    managedHtmlFor: string
    managedLabelId: string
    labelStyle: string
  }
>(
  ({
    isFieldset,
    managedHtmlFor,
    managedLabelId,
    labelStyle,
    dangerouslyTitleHidden,
    titleType,
    title,
    statusLabelList,
    subActionArea,
  }) => {
    const body = (
      <>
        <Text styleType={titleType}>{title}</Text>
        {statusLabelList.length > 0 && (
          <Cluster gap={0.25} as="span">
            {statusLabelList.map((prop, index) => (
              <StatusLabel {...prop} key={index} />
            ))}
          </Cluster>
        )}
      </>
    )

    const attrs = useMemo(() => {
      if (dangerouslyTitleHidden) {
        return {
          label: null,
          visuallyHidden: isFieldset
            ? {
                as: 'legend',
                hidden: true,
                id: managedLabelId,
              }
            : {
                as: 'label',
                hidden: true,
                htmlFor: managedHtmlFor,
                id: managedLabelId,
              },
        }
      }

      if (isFieldset) {
        return {
          label: { 'aria-hidden': 'true' } as const,
          visuallyHidden: { as: 'legend', hidden: true, id: managedLabelId },
        }
      }

      return {
        label: {
          as: 'label' as const,
          htmlFor: managedHtmlFor,
          id: managedLabelId,
        },
        visuallyHidden: null,
      }
    }, [managedLabelId, managedHtmlFor, dangerouslyTitleHidden, isFieldset])

    return (
      <>
        {attrs.visuallyHidden && (
          <VisuallyHiddenText {...attrs.visuallyHidden}>{innerText(body)}</VisuallyHiddenText>
        )}
        {attrs.label && (
          <Cluster justify="space-between">
            {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
            <Cluster {...attrs.label} align="center" className={labelStyle}>
              {body}
            </Cluster>
            {subActionArea && <div className="shr-grow">{subActionArea}</div>}
          </Cluster>
        )}
      </>
    )
  },
)

const HelpMessageParagraph = React.memo<Pick<Props, 'helpMessage'> & { managedHtmlFor: string }>(
  ({ helpMessage, managedHtmlFor }) =>
    helpMessage ? (
      <p className="smarthr-ui-FormControl-helpMessage" id={`${managedHtmlFor}_helpMessage`}>
        {helpMessage}
      </p>
    ) : null,
)

const ExampleMessageText = React.memo<Pick<Props, 'exampleMessage'> & { managedHtmlFor: string }>(
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

const ErrorMessageList = React.memo<{
  errorMessages: ReactNode[]
  managedHtmlFor: string
  errorListStyle: string
  errorIconStyle: string
}>(({ errorMessages, managedHtmlFor, errorListStyle, errorIconStyle }) =>
  errorMessages.length > 0 ? (
    <div id={`${managedHtmlFor}_errorMessages`} className={errorListStyle} role="alert">
      {errorMessages.map((message, index) => (
        <p key={index}>
          <FaCircleExclamationIcon text={message} className={errorIconStyle} />
        </p>
      ))}
    </div>
  ) : null,
)

const SupplementaryMessageText = React.memo<
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

export const FormControl: React.FC<Omit<Props & ElementProps, 'as' | 'disabled'>> =
  ActualFormControl
