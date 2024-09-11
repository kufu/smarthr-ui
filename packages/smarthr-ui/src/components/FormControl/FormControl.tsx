import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react'
import { isStyledComponent } from 'styled-components'
import { tv } from 'tailwind-variants'

import { useId } from '../../hooks/useId'
import { MultiComboBox, SingleComboBox } from '../ComboBox'
import { DatePicker } from '../DatePicker'
import { DropZone } from '../DropZone'
import { FaCircleExclamationIcon } from '../Icon'
import { CurrencyInput, Input } from '../Input'
import { InputFile } from '../InputFile'
import { Cluster, Stack } from '../Layout'
import { Select } from '../Select'
import { StatusLabel } from '../StatusLabel'
import { Text, TextProps } from '../Text'
import { Textarea } from '../Textarea'
import { TimePicker } from '../TimePicker'
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
  const managedHtmlFor = useId(htmlFor)
  const managedLabelId = useId(labelId)
  const isRoleGroup = as === 'fieldset'
  const statusLabelList = Array.isArray(statusLabelProps) ? statusLabelProps : [statusLabelProps]

  const describedbyIds = useMemo(
    () =>
      Object.entries({ helpMessage, exampleMessage, supplementaryMessage, errorMessages })
        .filter(({ 1: value }) => value)
        .map(([key]) => `${managedHtmlFor}_${key}`)
        .join(' '),
    [helpMessage, exampleMessage, supplementaryMessage, errorMessages, managedHtmlFor],
  )
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

  return (
    <Stack
      {...props}
      as={as}
      gap={innerMargin ?? 0.5}
      aria-labelledby={isRoleGroup ? managedLabelId : undefined}
      aria-describedby={isRoleGroup && describedbyIds ? describedbyIds : undefined}
      className={wrapperStyle}
    >
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
            {statusLabelList.map((statusLabelProp, index) => (
              <StatusLabel {...statusLabelProp} key={index} />
            ))}
          </Cluster>
        )}
      </Cluster>

      {helpMessage && (
        <p className="smarthr-ui-FormControl-helpMessage" id={`${managedHtmlFor}_helpMessage`}>
          {helpMessage}
        </p>
      )}
      {exampleMessage && (
        <Text
          as="p"
          color="TEXT_GREY"
          italic
          id={`${managedHtmlFor}_exampleMessage`}
          className="smarthr-ui-FormControl-exampleMessage"
        >
          {exampleMessage}
        </Text>
      )}

      {actualErrorMessages.length > 0 && (
        <div id={`${managedHtmlFor}_errorMessages`} className={errorListStyle} role="alert">
          {actualErrorMessages.map((message, index) => (
            <p key={index}>
              <FaCircleExclamationIcon text={message} className={errorIconStyle} />
            </p>
          ))}
        </div>
      )}

      <div className={childrenWrapperStyle}>
        {decorateFirstInputElement(children, {
          managedHtmlFor,
          describedbyIds,
          error: autoBindErrorInput && actualErrorMessages.length > 0,
        })}
      </div>

      {supplementaryMessage && (
        <Text
          as="p"
          size="S"
          color="TEXT_GREY"
          id={`${managedHtmlFor}_supplementaryMessage`}
          className="smarthr-ui-FormControl-supplementaryMessage"
        >
          {supplementaryMessage}
        </Text>
      )}
    </Stack>
  )
}

type DecorateFirstInputElementParams = {
  managedHtmlFor: string
  describedbyIds: string
  error: boolean
}

const decorateFirstInputElement = (
  children: ReactNode,
  params: DecorateFirstInputElementParams,
) => {
  const { managedHtmlFor, describedbyIds, error } = params
  let foundFirstInput = false

  const decorate = (targets: ReactNode): ReactNode[] | ReactNode =>
    React.Children.map(targets, (child) => {
      if (foundFirstInput || !React.isValidElement(child)) {
        return child
      }
      if (!isInputElement(child)) {
        return React.cloneElement(child, {}, decorate(child.props.children))
      }

      foundFirstInput = true

      const inputAttributes: ComponentProps<typeof Input> = {
        id: managedHtmlFor,
      }
      if (error) {
        inputAttributes.error = true
      }
      if (describedbyIds !== '') {
        inputAttributes['aria-describedby'] = describedbyIds
      }

      if (isComboBoxElement(child)) {
        return React.cloneElement(child, { inputAttributes })
      } else {
        return React.cloneElement(child, inputAttributes)
      }
    })

  return decorate(children)
}

type InputComponent =
  | typeof Input
  | typeof CurrencyInput
  | typeof Textarea
  | typeof DatePicker
  | typeof TimePicker
  | typeof Select
  | typeof SingleComboBox
  | typeof MultiComboBox
  | typeof InputFile
  | typeof DropZone

/**
 * - CheckBox / RadioButton は内部に label を含むため対象外
 * - SearchInput は label を含むため対象外
 * - InputWithTooltip は領域が狭く FormControl を置けない場所での使用を想定しているため対象外
 *
 * @param node
 * @returns
 */
const isInputElement = (
  element: ReactElement,
): element is React.ReactComponentElement<InputComponent> => {
  const type = isStyledComponent(element.type) ? element.type.target : element.type
  return (
    type === Input ||
    type === CurrencyInput ||
    type === Textarea ||
    type === DatePicker ||
    type === TimePicker ||
    type === Select ||
    type === SingleComboBox ||
    type === MultiComboBox ||
    type === InputFile ||
    type === DropZone
  )
}

type ComboboxComponent = typeof SingleComboBox | typeof MultiComboBox

const isComboBoxElement = (
  element: ReactElement,
): element is React.ReactComponentElement<ComboboxComponent> => {
  const type = isStyledComponent(element.type) ? element.type.target : element.type
  return type === SingleComboBox || type === MultiComboBox
}

export const FormControl: React.FC<Omit<Props & ElementProps, 'as' | 'disabled'>> =
  ActualFormControl
