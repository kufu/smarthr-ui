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
import { tv } from 'tailwind-variants'

import { FaCircleExclamationIcon } from '../Icon'
import { Cluster, Stack } from '../Layout'
import { StatusLabel } from '../StatusLabel'
import { Text, TextProps } from '../Text'
import { visuallyHiddenText } from '../VisuallyHiddenText/VisuallyHiddenText'

import type { Gap } from '../../types'

type StatusLabelProps = ComponentProps<typeof StatusLabel>

type Props = PropsWithChildren<{
  /** グループのタイトル名 */
  title: ReactNode
  /** タイトルの見出しのタイプ */
  titleType?: TextProps['styleType']
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
    label: [
      'smarthr-ui-FormControl-label',
      // flex-item が stretch してクリッカブル領域が広がりすぎないようにする
      'shr-self-start',
      'shr-px-[unset]',
    ],
    errorList: ['shr-list-none'],
    errorIcon: ['smarthr-ui-FormControl-errorMessage', 'shr-text-danger'],
  },
})

const childrenWrapper = tv({
  variants: {
    innerMargin: {
      0: '[&&&]:shr-mt-0',
      0.25: '[&&&]:shr-mt-0.25',
      0.5: '[&&&]:shr-mt-0.5',
      0.75: '[&&&]:shr-mt-0.75',
      1: '[&&&]:shr-mt-1',
      1.25: '[&&&]:shr-mt-1.25',
      1.5: '[&&&]:shr-mt-1.5',
      2: '[&&&]:shr-mt-2',
      2.5: '[&&&]:shr-mt-2.5',
      3: '[&&&]:shr-mt-3',
      3.5: '[&&&]:shr-mt-3.5',
      4: '[&&&]:shr-mt-4',
      8: '[&&&]:shr-mt-8',
      X3S: '[&&&]:shr-mt-0.25',
      XXS: '[&&&]:shr-mt-0.5',
      XS: '[&&&]:shr-mt-1',
      S: '[&&&]:shr-mt-1.5',
      M: '[&&&]:shr-mt-2',
      L: '[&&&]:shr-mt-2.5',
      XL: '[&&&]:shr-mt-3',
      XXL: '[&&&]:shr-mt-3.5',
      X3L: '[&&&]:shr-mt-4',
    } as { [key in Gap]: string },
    isRoleGroup: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      innerMargin: undefined,
      isRoleGroup: true,
      className: '[:not([hidden])_~_&&&]:shr-mt-1',
    },
    {
      innerMargin: undefined,
      isRoleGroup: false,
      className: '[:not([hidden])_~_&&&]:shr-mt-0.5',
    },
  ],
})

export const ActualFormControl: React.FC<Props & ElementProps> = ({
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
  const isRoleGroup = as === 'fieldset'
  const statusLabelList = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps]

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
  const actualErrorMessages = useMemo(() => {
    if (!errorMessages) {
      return []
    }

    return Array.isArray(errorMessages) ? errorMessages : [errorMessages]
  }, [errorMessages])

  const { wrapperStyle, labelStyle, errorListStyle, errorIconStyle, childrenWrapperStyle } =
    useMemo(() => {
      const { wrapper, label, errorList, errorIcon } = formGroup()
      return {
        wrapperStyle: wrapper({ className }),
        labelStyle: label({ className: dangerouslyTitleHidden ? visuallyHiddenText() : '' }),
        errorListStyle: errorList(),
        errorIconStyle: errorIcon(),
        childrenWrapperStyle: childrenWrapper({ innerMargin, isRoleGroup }),
      }
    }, [className, dangerouslyTitleHidden, innerMargin, isRoleGroup])

  useEffect(() => {
    if (isRoleGroup) {
      return
    }

    const inputWrapper = inputWrapperRef?.current

    if (inputWrapper) {
      // HINT: 対象idを持つ要素が既に存在する場合、何もしない
      if (document.getElementById(managedHtmlFor)) {
        return
      }

      const input = inputWrapper.querySelector('[data-smarthr-ui-input="true"]')

      if (input) {
        if (!input.getAttribute('id')) {
          input.setAttribute('id', managedHtmlFor)
        }

        const isInputFile = input instanceof HTMLInputElement && input.type === 'file'
        const inputLabelledByIds = input.getAttribute('aria-labelledby')
        if (isInputFile && inputLabelledByIds) {
          // InputFileの場合はlabel要素の可視ラベルをアクセシブルネームに含める
          input.setAttribute('aria-labelledby', `${inputLabelledByIds} ${managedLabelId}`)
        }
      }
    }
  }, [managedHtmlFor, isRoleGroup, managedLabelId])
  useEffect(() => {
    const inputWrapper = inputWrapperRef?.current

    if (inputWrapper) {
      // HINT: 対象idを持つ要素が既に存在する場合、何もしない
      if (!describedbyIds || inputWrapper.querySelector(`[aria-describedby="${describedbyIds}"]`)) {
        return
      }

      const input = inputWrapper.querySelector('[data-smarthr-ui-input="true"]')

      if (input && !input.getAttribute('aria-describedby')) {
        input.setAttribute('aria-describedby', describedbyIds)
      }
    }
  }, [describedbyIds, isRoleGroup])
  useEffect(() => {
    if (!autoBindErrorInput) {
      return
    }

    const inputWrapper = inputWrapperRef?.current

    if (inputWrapper) {
      const input = inputWrapper.querySelector('[data-smarthr-ui-input="true"]')

      if (!input) {
        return
      }

      if (actualErrorMessages.length > 0) {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    }
  }, [actualErrorMessages.length, autoBindErrorInput])

  return (
    <Stack
      {...props}
      as={as}
      gap={innerMargin ?? 0.5}
      aria-labelledby={isRoleGroup ? managedLabelId : undefined}
      aria-describedby={isRoleGroup && describedbyIds ? describedbyIds : undefined}
      className={wrapperStyle}
    >
      <TitleCluster
        isRoleGroup={isRoleGroup}
        managedHtmlFor={managedHtmlFor}
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

const TitleCluster = React.memo<
  Pick<Props, 'dangerouslyTitleHidden' | 'title'> & {
    titleType: TextProps['styleType']
    statusLabelList: StatusLabelProps[]
    isRoleGroup: boolean
    managedHtmlFor: string
    managedLabelId: string
    labelStyle: string
  }
>(
  ({
    isRoleGroup,
    managedHtmlFor,
    managedLabelId,
    labelStyle,
    dangerouslyTitleHidden,
    titleType,
    title,
    statusLabelList,
  }) => (
    <Cluster
      align="center"
      htmlFor={!isRoleGroup ? managedHtmlFor : undefined}
      id={managedLabelId}
      className={labelStyle}
      as={isRoleGroup ? 'legend' : 'label'}
      // Stack 対象にしないための hidden
      hidden={dangerouslyTitleHidden || undefined}
    >
      <Text as="span" styleType={titleType}>
        {title}
      </Text>
      {statusLabelList.length > 0 && (
        <Cluster gap={0.25} as="span">
          {statusLabelList.map((prop, index) => (
            <StatusLabel {...prop} key={index} />
          ))}
        </Cluster>
      )}
    </Cluster>
  ),
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
}>(({ errorMessages, managedHtmlFor, errorListStyle, errorIconStyle }) => {
  if (errorMessages.length === 0) {
    return null
  }

  return (
    <div id={`${managedHtmlFor}_errorMessages`} className={errorListStyle} role="alert">
      {errorMessages.map((message, index) => (
        <p key={index}>
          <FaCircleExclamationIcon text={message} className={errorIconStyle} />
        </p>
      ))}
    </div>
  )
})

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
