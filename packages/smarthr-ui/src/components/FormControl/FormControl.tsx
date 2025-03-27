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
} from 'react'
import { useId } from 'react'
import innerText from 'react-innertext'
import { tv } from 'tailwind-variants'

import { FaCircleExclamationIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { StatusLabel } from '../StatusLabel'
import { Text, type TextProps } from '../Text'
import { VisuallyHiddenText, visuallyHiddenTextClassNameGenerator } from '../VisuallyHiddenText'

import type { Gap } from '../../types'

type StatusLabelProps = ComponentProps<typeof StatusLabel>
type StatusLabelType = FunctionComponentElement<StatusLabelProps>

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
  /**
   * @deprecated statusLabelProps属性は非推奨です。statusLabelsを使ってください。
   */
  statusLabelProps?: StatusLabelProps | StatusLabelProps[]
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
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props | 'aria-labelledby'>

const classNameGenerator = tv({
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
    underTitleStack: ['[&&&]:shr-mt-0'],
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

export const ActualFormControl: FC<Props & ElementProps> = ({
  title,
  titleType = 'blockTitle',
  subActionArea,
  dangerouslyTitleHidden = false,
  htmlFor,
  labelId,
  innerMargin,
  statusLabels,
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

  const actualStatusLabels = useMemo(() => {
    if (statusLabels) {
      return Array.isArray(statusLabels) ? statusLabels : [statusLabels]
    }

    if (!statusLabelProps) {
      return []
    }

    const labelProps = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps]

    return labelProps.map((prop, index) => <StatusLabel {...prop} key={index} />)
  }, [statusLabels, statusLabelProps])

  const actualErrorMessages = useMemo(() => {
    if (!errorMessages) {
      return []
    }

    return Array.isArray(errorMessages) ? errorMessages : [errorMessages]
  }, [errorMessages])

  const actualInnerMargin = useMemo(() => innerMargin ?? 0.5, [innerMargin])

  const classNames = useMemo(() => {
    const { wrapper, label, errorList, errorIcon, underTitleStack, childrenWrapper } =
      classNameGenerator({ innerMargin, isFieldset })

    return {
      wrapper: wrapper({ className }),
      label: label({
        className: dangerouslyTitleHidden ? visuallyHiddenTextClassNameGenerator() : '',
      }),
      errorList: errorList(),
      errorIcon: errorIcon(),
      underTitleStack: underTitleStack(),
      childrenWrapper: childrenWrapper(),
    }
  }, [innerMargin, isFieldset, dangerouslyTitleHidden, className])

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

  // HINT: dangerouslyTitleHiddenの場合、body以下の余白の計算を簡略化するため
  // Stackをネストし、そのStackに対してmargin-top: 0を指定する
  // こうすることでinner Stack以下の要素は擬似的にStackの最初の要素になる
  if (dangerouslyTitleHidden) {
    body = (
      // eslint-disable-next-line smarthr/best-practice-for-layouts
      <Stack gap={actualInnerMargin} className={classNames.underTitleStack}>
        {body}
      </Stack>
    )
  }

  return (
    <Stack
      {...props}
      as={as}
      gap={actualInnerMargin}
      aria-describedby={isFieldset && describedbyIds ? describedbyIds : undefined}
      className={classNames.wrapper}
    >
      <TitleCluster
        isFieldset={isFieldset}
        managedHtmlFor={managedHtmlFor}
        managedLabelId={managedLabelId}
        dangerouslyTitleHidden={dangerouslyTitleHidden}
        titleType={titleType}
        title={title}
        statusLabels={actualStatusLabels}
        subActionArea={subActionArea}
        labelClassName={classNames.label}
      />
      {body}
    </Stack>
  )
}

const TitleCluster = memo<
  Pick<Props, 'dangerouslyTitleHidden' | 'title' | 'subActionArea'> & {
    titleType: TextProps['styleType']
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
    dangerouslyTitleHidden,
    titleType,
    title,
    subActionArea,
    labelClassName,
    statusLabels,
  }) => {
    const body = (
      <>
        <Text styleType={titleType}>{title}</Text>
        <StatusLabelCluster statusLabels={statusLabels} />
      </>
    )

    const attrs = useMemo(() => {
      if (dangerouslyTitleHidden) {
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
    }, [managedLabelId, managedHtmlFor, dangerouslyTitleHidden, isFieldset])

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
            {/* eslint-disable-next-line smarthr/best-practice-for-layouts */}
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
    // eslint-disable-next-line smarthr/best-practice-for-layouts
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
  }
}>(({ errorMessages, managedHtmlFor, classNames }) =>
  errorMessages.length > 0 ? (
    <div id={`${managedHtmlFor}_errorMessages`} className={classNames.errorList} role="alert">
      {errorMessages.map((message, index) => (
        <p key={index}>
          <FaCircleExclamationIcon text={message} className={classNames.errorIcon} />
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

export const FormControl: FC<Omit<Props & ElementProps, 'as' | 'disabled'>> = ActualFormControl
