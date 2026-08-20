'use client'

import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type FC,
  type FunctionComponentElement,
  type PropsWithChildren,
  type ReactNode,
  type RefObject,
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { FaCircleExclamationIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { Text, type TextProps } from '../Text'
import { VisuallyHiddenText, visuallyHiddenTextClassName } from '../VisuallyHiddenText'

import type { Gap } from '../../types'
import type { StatusLabel } from '../StatusLabel'

type StatusLabelType = FunctionComponentElement<ComponentProps<typeof StatusLabel>>
type IconType = ComponentProps<typeof Text>['icon']

export type ObjectLabelType = {
  text: ReactNode
  /** ラベルの表示タイプ */
  styleType?: TextProps['styleType']
  /** ラベル左に設置するアイコン */
  icon?: IconType
  /** ラベルを視覚的に隠すかどうか */
  unrecommendedHide?: boolean
  /** ラベルを紐づける入力要素のID属性と同じ値 */
  htmlFor?: string
  /** ラベルに適用する `id` 値 */
  id?: string
}
type BaseProps = PropsWithChildren<{
  /** グループのラベル名 */
  label: ReactNode | ObjectLabelType
  /** タイトル右の領域 */
  subActionArea?: ReactNode
  /** タイトル群と子要素の間の間隔調整用（基本的には不要） */
  innerMargin?: Gap
  /** タイトルの隣に表示する `StatusLabel` の配列 */
  statusLabels?: StatusLabelType | StatusLabelType[]
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
}>
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps | 'aria-labelledby'>

export const labelObjectConverter = (label: ReactNode) => ({ text: label })

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
    label: ['smarthr-ui-FormControl-label'],
    errorList: ['shr-list-none'],
    errorIcon: ['smarthr-ui-FormControl-errorMessage-Icon', 'shr-text-danger'],
    errorMessage: ['smarthr-ui-FormControl-errorMessage'],
    childrenWrapper: [],
  },
})

export const SMARTHR_UI_INPUT_SELECTOR = '[data-smarthr-ui-input="true"]'
export const SMARTHR_UI_LABEL_TEXT_SELECTOR = 'smarthr-ui-FormControl-labelText'

export const FormControl: FC<Props> = ({ label: orgLabel, ...rest }) => {
  const label = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLabel,
    labelObjectConverter,
  )
  const baseId = useId()
  const [childInputId, setChildInputId] = useState<string>('')
  const managedHtmlFor = label.htmlFor || childInputId || `${baseId}-htmlFor`
  const managedLabelId = label.id || `${baseId}-label`
  const inputWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !inputWrapperRef.current ||
      // HINT: 対象idを持つ要素が既に存在する場合、何もしない
      document.getElementById(managedHtmlFor)
    ) {
      return
    }

    const input = inputWrapperRef.current.querySelector(SMARTHR_UI_INPUT_SELECTOR)

    if (!input) {
      return
    }

    const inputId = input.getAttribute('id')

    if (inputId) {
      setChildInputId(inputId)
    } else {
      input.setAttribute('id', managedHtmlFor)
    }

    if (input instanceof HTMLInputElement && input.type === 'file') {
      const attrName = 'aria-labelledby'
      const inputLabelledByIds = input.getAttribute(attrName)

      if (inputLabelledByIds) {
        // InputFileの場合はlabel要素の可視ラベルをアクセシブルネームに含める
        input.setAttribute(attrName, `${inputLabelledByIds} ${managedLabelId}`)
      }
    }
  }, [managedHtmlFor, managedLabelId])

  return (
    <ActualFormControl
      {...rest}
      label={{ ...label, htmlFor: managedHtmlFor, id: managedLabelId }}
      inputWrapperRef={inputWrapperRef}
    />
  )
}

export const ActualFormControl: FC<
  Omit<Props, 'label'> & {
    label: Omit<ObjectLabelType, 'htmlFor' | 'id'> &
      Required<Pick<ObjectLabelType, 'htmlFor' | 'id'>>
    /** `true` のとき、文字色を `TEXT_DISABLED` にする */
    disabled?: boolean
    as?: string | ComponentType<any>
    inputWrapperRef: RefObject<HTMLDivElement>
    /** `childrenWrapper` に追加するクラス名 */
    childrenWrapperClassName?: string
  }
> = ({
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
  inputWrapperRef,
  childrenWrapperClassName,
  ...rest
}) => {
  const isFieldset = as === 'fieldset'

  const describedbyIds = useMemo(() => {
    const temp = []

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
      errorList: generators.errorList(),
      errorIcon: generators.errorIcon(),
      errorMessage: generators.errorMessage(),
      childrenWrapper: generators.childrenWrapper({ className: childrenWrapperClassName }),
    }
  }, [label.unrecommendedHide, className, childrenWrapperClassName])

  useEffect(() => {
    if (!describedbyIds || !inputWrapperRef.current) {
      return
    }

    const inputWrapper = inputWrapperRef.current
    const attrName = 'aria-describedby'

    if (inputWrapper.querySelector(`[${attrName}="${describedbyIds}"]`)) {
      return
    }

    const input = inputWrapper.querySelector(SMARTHR_UI_INPUT_SELECTOR)

    if (input) {
      const attribute = input.getAttribute(attrName)

      input.setAttribute(attrName, attribute ? `${attribute} ${describedbyIds}` : describedbyIds)
    }
  }, [describedbyIds, inputWrapperRef])

  useEffect(() => {
    if (!autoBindErrorInput || !inputWrapperRef.current) {
      return
    }

    const input = inputWrapperRef.current.querySelector(SMARTHR_UI_INPUT_SELECTOR)

    if (input) {
      const attrName = 'aria-invalid'

      if (actualErrorMessages.length > 0) {
        input.setAttribute(attrName, 'true')
      } else {
        input.removeAttribute(attrName)
      }
    }
  }, [actualErrorMessages.length, autoBindErrorInput, inputWrapperRef])

  return (
    <Stack
      {...rest}
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
      <ErrorMessageList
        errorMessages={actualErrorMessages}
        managedHtmlFor={label.htmlFor}
        classNames={classNames}
      />
      <div ref={inputWrapperRef} className={classNames.childrenWrapper}>
        {children}
      </div>
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
        <Text styleType={labelType} icon={labelIcon} className={SMARTHR_UI_LABEL_TEXT_SELECTOR}>
          {label}
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
  classNames: {
    errorList: string
    errorIcon: string
    errorMessage: string
  }
}>(({ errorMessages, managedHtmlFor, classNames }) =>
  errorMessages.length > 0 ? (
    <div id={`${managedHtmlFor}_errorMessages`} className={classNames.errorList} role="alert">
      {errorMessages.map((message, index) => (
        <p key={index}>
          <Text
            className={classNames.errorMessage}
            icon={<FaCircleExclamationIcon className={classNames.errorIcon} />}
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
