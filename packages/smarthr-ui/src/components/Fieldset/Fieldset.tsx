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

import {
  ErrorMessageList,
  ExampleMessageText,
  HelpMessageParagraph,
  SupplementaryMessageText,
  TitleCluster,
} from '../FormControl'
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
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof Props | 'aria-labelledby'>

const formGroup = tv({
  slots: {
    wrapper: [
      'smarthr-ui-FormControl',
      'shr-mx-[unset] shr-border-none shr-p-[unset]',
      'disabled:shr-text-disabled',
      '[&:disabled_.smarthr-ui-FormControl-label_>_span]:shr-text-disabled',
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
  },
  compoundVariants: [
    {
      innerMargin: undefined,
      className: '[:not([hidden])_~_&&&]:shr-mt-1',
    },
    {
      innerMargin: undefined,
      className: '[:not([hidden])_~_&&&]:shr-mt-0.5',
    },
  ],
})

export const Fieldset: React.FC<Props & ElementProps> = ({
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
  className,
  children,
  ...props
}) => {
  const defaultHtmlFor = useId()
  const defaultLabelId = useId()
  const managedHtmlFor = htmlFor || defaultHtmlFor
  const managedLabelId = labelId || defaultLabelId
  const inputWrapperRef = useRef<HTMLDivElement>(null)
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
        childrenWrapperStyle: childrenWrapper({ innerMargin }),
      }
    }, [className, dangerouslyTitleHidden, innerMargin])

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
      as="fieldset"
      gap={innerMargin ?? 0.5}
      aria-labelledby={managedLabelId}
      aria-describedby={describedbyIds ? describedbyIds : undefined}
      className={wrapperStyle}
    >
      <TitleCluster
        as="legend"
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
