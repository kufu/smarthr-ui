'use client'

import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type FC,
  type FunctionComponentElement,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useId } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { FaCircleExclamationIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { Text, type TextProps } from '../Text'
import { VisuallyHiddenText, visuallyHiddenTextClassName } from '../VisuallyHiddenText'

import type { Gap } from '../../types'
import type { StatusLabel } from '../StatusLabel'

type StatusLabelType = FunctionComponentElement<ComponentProps<typeof StatusLabel>>

type ObjectLabelType = {
  text: ReactNode
  /** ラベルの表示タイプ */
  styleType?: TextProps['styleType']
  /** ラベル左に設置するアイコン */
  icon?: ReactNode
  /** ラベルを視覚的に隠すかどうか */
  unrecommendedHide?: boolean
  /** ラベルを紐づける入力要素のID属性と同じ値 */
  htmlFor?: string
  /** ラベルに適用する `id` 値 */
  id?: string
}
type AbstractProps = PropsWithChildren<{
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
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
  as?: string | ComponentType<any>
}>
type Props = AbstractProps &
  Omit<ComponentPropsWithoutRef<'div'>, keyof AbstractProps | 'aria-labelledby'>

const labelObjectConverter = (label: ReactNode) => ({ text: label })

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
    underLabelStack: ['[&&&]:shr-mt-0'],
    childrenWrapper: [],
  },
  variants: {
    innerMargin: {
      0: {},
      0.25: {},
      0.5: {},
      0.75: {},
      1: {},
      1.25: {},
      1.5: {},
      2: {},
      2.5: {},
      3: {},
      3.5: {},
      4: {},
      8: {},
      X3S: {},
      XXS: {},
      XS: {},
      S: {},
      M: {},
      L: {},
      XL: {},
      XXL: {},
      X3L: {},
    } as { [key in Gap]: string },
    isFieldset: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    // TODO: innerMarginが未指定、初期値の場合、かつFieldsetの場合、childrenの上部の余白を広げることで
    // FormControltとの差をわかりやすくしている
    // 微妙な方法ではあるので、必要に応じてinnerMarginではない属性を用意する
    // https://kufuinc.slack.com/archives/CGC58MW01/p1737944965871159?thread_ts=1737541173.404369&cid=CGC58MW01
    {
      innerMargin: undefined,
      isFieldset: true,
      class: {
        childrenWrapper: '[:not([hidden])_~_&&&]:shr-mt-1',
      },
    },
    {
      innerMargin: undefined,
      isFieldset: false,
      class: {
        childrenWrapper: '[:not([hidden])_~_&&&]:shr-mt-0.5',
      },
    },
  ],
})

const SMARTHR_UI_INPUT_SELECTOR = '[data-smarthr-ui-input="true"]'

export const ActualFormControl: FC<Props> = ({
  label: orgLabel,
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
  const label = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLabel,
    labelObjectConverter,
  )
  const defaultHtmlFor = useId()
  const defaultLabelId = useId()
  const [childInputId, setChildInputId] = useState<string>('')
  const managedHtmlFor = label.htmlFor || childInputId || defaultHtmlFor
  const managedLabelId = label.id || defaultLabelId
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

  const actualInnerMargin = useMemo(() => innerMargin ?? 0.5, [innerMargin])

  const classNames = useMemo(() => {
    const generators = classNameGenerator({ innerMargin, isFieldset })

    return {
      wrapper: generators.wrapper({ className }),
      label: generators.label({
        className: label.unrecommendedHide ? visuallyHiddenTextClassName : '',
      }),
      errorList: generators.errorList(),
      errorIcon: generators.errorIcon(),
      errorMessage: generators.errorMessage(),
      underLabelStack: generators.underLabelStack(),
      childrenWrapper: generators.childrenWrapper(),
    }
  }, [innerMargin, isFieldset, label.unrecommendedHide, className])

  useEffect(() => {
    if (
      isFieldset ||
      !inputWrapperRef?.current ||
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
  }, [managedHtmlFor, isFieldset, managedLabelId])

  useEffect(() => {
    if (!describedbyIds || !inputWrapperRef?.current) {
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
  }, [describedbyIds])

  useEffect(() => {
    if (!autoBindErrorInput || !inputWrapperRef?.current) {
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
  }, [actualErrorMessages.length, autoBindErrorInput])

  // HINT: Fieldset内の可視ラベルが無いinputに、legend文言をアクセシブルネームに追加する
  // https://waic.jp/translations/WCAG21/Understanding/label-in-name.html
  useEffect(() => {
    if (!isFieldset || !inputWrapperRef.current) return

    const inputs =
      inputWrapperRef.current.querySelectorAll<HTMLInputElement>(SMARTHR_UI_INPUT_SELECTOR)

    if (!inputs.length) return

    const legendText = innerText(label.text)

    if (!legendText) return

    inputs.forEach((input: HTMLInputElement) => {
      const accessibleName =
        input.getAttribute('aria-label') ||
        (input.labels?.[0]?.classList.contains('smarthr-ui-VisuallyHiddenText')
          ? input.labels![0].textContent
          : '')

      if (
        accessibleName &&
        !accessibleName.includes(legendText) &&
        !legendText.includes(accessibleName)
      ) {
        input.setAttribute('aria-label', `${accessibleName} ${legendText}`)
      }
    })
  }, [isFieldset, label.text])

  let body = (
    <>
      <HelpMessageParagraph helpMessage={helpMessage} managedHtmlFor={managedHtmlFor} />
      <ExampleMessageText exampleMessage={exampleMessage} managedHtmlFor={managedHtmlFor} />
      <ErrorMessageList
        errorMessages={actualErrorMessages}
        managedHtmlFor={managedHtmlFor}
        classNames={classNames}
      />
      <div className={classNames.childrenWrapper} ref={inputWrapperRef}>
        {children}
      </div>
      <SupplementaryMessageText
        supplementaryMessage={supplementaryMessage}
        managedHtmlFor={managedHtmlFor}
      />
    </>
  )

  // HINT: label.unrecommendedHideの場合、body以下の余白の計算を簡略化するため
  // Stackをネストし、そのStackに対してmargin-top: 0を指定する
  // こうすることでinner Stack以下の要素は擬似的にStackの最初の要素になる
  if (label.unrecommendedHide) {
    body = (
      <Stack gap={actualInnerMargin} className={classNames.underLabelStack}>
        {body}
      </Stack>
    )
  }

  return (
    <Stack
      {...rest}
      as={as}
      gap={actualInnerMargin}
      aria-describedby={isFieldset && describedbyIds ? describedbyIds : undefined}
      className={classNames.wrapper}
    >
      <LabelCluster
        isFieldset={isFieldset}
        managedHtmlFor={managedHtmlFor}
        managedLabelId={managedLabelId}
        unrecommendedHideLabel={label.unrecommendedHide}
        labelType={label.styleType}
        label={label.text}
        labelIcon={label.icon}
        statusLabels={actualStatusLabels}
        subActionArea={subActionArea}
        labelClassName={classNames.label}
      />
      {body}
    </Stack>
  )
}

const LabelCluster = memo<
  Pick<Props, 'subActionArea'> & {
    label: ReactNode
    labelType: TextProps['styleType']
    labelIcon?: ReactNode
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
          {label}
        </Text>
        <StatusLabelCluster statusLabels={statusLabels} />
      </>
    )

    const attrs = useMemo(() => {
      if (unrecommendedHideLabel) {
        return {
          label: null,
          visuallyHidden: isFieldset
            ? {
                as: 'legend',
              }
            : {
                as: 'label',
                htmlFor: managedHtmlFor,
                id: managedLabelId,
              },
        }
      }

      if (isFieldset) {
        return {
          label: { 'aria-hidden': 'true' } as const,
          visuallyHidden: { as: 'legend' },
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
    }, [managedLabelId, managedHtmlFor, unrecommendedHideLabel, isFieldset])

    return (
      <>
        {attrs.visuallyHidden && (
          <VisuallyHiddenText {...attrs.visuallyHidden}>
            {
              // HINT: innerTextでは正しく文字が取得できない場合がある
              // 安全策としてinnerTextが空を取得してきたらbody自体を埋めこみます
              innerText(body) || body
            }
          </VisuallyHiddenText>
        )}
        {attrs.label && (
          <Cluster
            justify="space-between"
            // HINT: UI上、常にトップの要素になるため、Stackの計算が狂わないよう、
            // 常にmargin-topを0にする
            className="[&&&]:shr--mt-0"
          >
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

export const FormControl: FC<Omit<Props, 'as' | 'disabled'>> = ActualFormControl
