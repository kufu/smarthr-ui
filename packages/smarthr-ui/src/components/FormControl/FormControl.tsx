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

type ObjectLabelType = {
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
  /** `true` のとき、文字色を `TEXT_DISABLED` にする */
  disabled?: boolean
  as?: string | ComponentType<any>
}>
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps | 'aria-labelledby'>

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
    childrenWrapper: ['smarthr-ui-FormControl-childrenWrapper'],
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
        childrenWrapper: '[:not([hidden])_~_&&&]:shr-mt-0.5',
      },
    },
  ],
})

const SMARTHR_UI_INPUT_SELECTOR = '[data-smarthr-ui-input="true"]'
const CHILDREN_WRAPPER_INPUT_SELECTOR = `.smarthr-ui-FormControl-childrenWrapper ${SMARTHR_UI_INPUT_SELECTOR}`
const LABEL_TEXT_SELECTOR = '.smarthr-ui-FormControl-labelText'

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
  const baseId = useId()
  const [childInputId, setChildInputId] = useState<string>('')
  const managedHtmlFor = label.htmlFor || childInputId || `${baseId}-htmlFor`
  const managedLabelId = label.id || `${baseId}-label`
  const wrapperRef = useRef<HTMLDivElement>(null)
  const managedDescribedbyIdsRef = useRef<string[]>([])
  const isFieldset = as === 'fieldset'

  const describedbyIds = useMemo(() => {
    const temp: string[] = []

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
      childrenWrapper: generators.childrenWrapper(),
    }
  }, [innerMargin, isFieldset, label.unrecommendedHide, className])

  useEffect(() => {
    if (
      isFieldset ||
      !wrapperRef.current ||
      // HINT: 対象idを持つ要素が既に存在する場合、何もしない
      document.getElementById(managedHtmlFor)
    ) {
      return
    }

    const input = wrapperRef.current.querySelector(CHILDREN_WRAPPER_INPUT_SELECTOR)

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
      const inputLabelledByIds = input.getAttribute('aria-labelledby')

      if (inputLabelledByIds) {
        // InputFileの場合はlabel要素の可視ラベルをアクセシブルネームに含める
        input.setAttribute('aria-labelledby', `${inputLabelledByIds} ${managedLabelId}`)
      }
    }
  }, [managedHtmlFor, isFieldset, managedLabelId])

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
  }, [describedbyIds])

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
  }, [actualErrorMessages.length, autoBindErrorInput])

  // HINT: Fieldset内の可視ラベルが無いinputに、legend文言をアクセシブルネームに追加する
  // https://waic.jp/translations/WCAG21/Understanding/label-in-name.html
  useEffect(() => {
    if (!isFieldset || !wrapperRef.current) return

    const labelTextEl = wrapperRef.current.querySelector(LABEL_TEXT_SELECTOR)

    if (!labelTextEl) return

    // HINT: legend変更のたびにaria-labelへ古いlegend文言が蓄積しないよう、
    // 初回に確定したアクセシブルネームをinput要素ごとに保持しておく
    const baseAccessibleNames = new WeakMap<HTMLInputElement, string>()

    const updateAriaLabels = () => {
      const labelText = labelTextEl.textContent || ''
      if (!labelText) return

      const inputs = wrapperRef.current?.querySelectorAll<HTMLInputElement>(
        CHILDREN_WRAPPER_INPUT_SELECTOR,
      )
      if (!inputs?.length) return

      inputs.forEach((input: HTMLInputElement) => {
        let accessibleName = baseAccessibleNames.get(input)

        if (accessibleName === undefined) {
          accessibleName =
            input.getAttribute('aria-label') ||
            (input.labels?.[0]?.classList.contains('smarthr-ui-VisuallyHiddenText')
              ? input.labels[0].textContent || ''
              : '')
          baseAccessibleNames.set(input, accessibleName)
        }

        if (
          accessibleName &&
          !accessibleName.includes(labelText) &&
          !labelText.includes(accessibleName)
        ) {
          input.setAttribute('aria-label', `${accessibleName} ${labelText}`)
        }
      })
    }

    // 初回実行
    updateAriaLabels()

    // label要素の変更を監視
    const observer = new MutationObserver(updateAriaLabels)
    observer.observe(labelTextEl, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [isFieldset])

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
      <HelpMessageParagraph helpMessage={helpMessage} managedHtmlFor={managedHtmlFor} />
      <ExampleMessageText exampleMessage={exampleMessage} managedHtmlFor={managedHtmlFor} />
      <ErrorMessageList
        errorMessages={actualErrorMessages}
        managedHtmlFor={managedHtmlFor}
        classNames={classNames}
      />
      <div className={classNames.childrenWrapper}>{children}</div>
      <SupplementaryMessageText
        supplementaryMessage={supplementaryMessage}
        managedHtmlFor={managedHtmlFor}
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
