'use client'

import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type OptgroupHTMLAttributes,
  type OptionHTMLAttributes,
  type PropsWithChildren,
  memo,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'
import { useIntl } from '../../intl'
import { isIOS, isMobileSafari } from '../../libs/ua'
import { genericsForwardRef } from '../../libs/util'
import { FaAngleDownIcon } from '../Icon'

type Option<T extends string> = {
  value: T
} & Omit<OptionHTMLAttributes<HTMLOptionElement>, 'value'>
type Optgroup<T extends string> = {
  label: string
  options: Array<Option<T>>
} & OptgroupHTMLAttributes<HTMLOptGroupElement>

type AbstractProps<T extends string> = {
  /** 選択肢のデータの配列 */
  options: Array<Option<T> | Optgroup<T>>
  /** フォームの値が変わったときに発火するコールバック関数 */
  onChangeValue?: (value: T) => void
  /** フォームの値にエラーがあるかどうか */
  error?: boolean
  /** コンポーネントの幅 */
  width?: number | string
  /** コンポーネントの大きさ */
  size?: 'default' | 's'
  /** 空の選択肢を表示するかどうか */
  hasBlank?: boolean
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

type Props<T extends string> = AbstractProps<T> &
  Omit<ComponentPropsWithoutRef<'select'>, keyof AbstractProps<string> | 'children'>

type DecoratorKeyTypes = 'blankLabel'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-Select shr-relative shr-inline-block',
    select: [
      'shr-peer shr-border-shorthand shr-w-full shr-cursor-pointer shr-appearance-none shr-rounded-m shr-bg-white shr-text-base shr-leading-tight shr-text-black',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-pointer-events-none disabled:shr-bg-white-darken disabled:shr-text-disabled disabled:shr-opacity-100',
      'contrast-more:shr-border-high-contrast',
      /* padding に依る積み上げでは文字が見切れてしまうため */
      'shr-min-h-[calc(theme(fontSize.base)_+_theme(spacing[0.75])_*_2_+_theme(spacing.px)_*_2)]',
      'shr-border-default disabled:shr-border-disabled',
      'aria-[invalid]:shr-border-danger',
    ],
    iconWrap: [
      'shr-pointer-events-none shr-absolute shr-inset-y-0 shr-inline-flex shr-items-center shr-text-grey',
      'peer-focus-visible:shr-text-black peer-disabled:shr-text-disabled',
    ],
    blankOptgroup: 'shr-hidden',
  },
  variants: {
    size: {
      default: {
        select: 'shr-py-0.5 shr-pe-2 shr-ps-0.5',
        // ((右 padding - アイコン幅) / 2) + 右 border
        iconWrap: 'shr-end-[calc(theme(spacing[0.5])_+_theme(spacing.px))]',
      },
      s: {
        select: [
          'shr-px-0.5 shr-py-0.25 shr-pe-1.5 shr-text-sm',
          /* padding に依る積み上げでは文字が見切れてしまうため */
          'shr-min-h-[calc(theme(fontSize.sm)_+_theme(spacing[0.5])_*_2_+_theme(spacing.px)_*_2)]',
        ],
        iconWrap: 'shr-end-0.5 shr-text-sm',
      },
    },
  },
})

const ActualSelect = <T extends string>(
  {
    options,
    onChange,
    onChangeValue,
    error,
    width,
    hasBlank,
    decorators,
    size,
    className,
    disabled,
    required,
    ...rest
  }: Props<T>,
  ref: ForwardedRef<HTMLSelectElement>,
) => {
  const { localize } = useIntl()

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e)

      if (onChangeValue) {
        const flattenOptions = options.reduce(
          (pre, cur) => pre.concat('value' in cur ? cur : cur.options),
          [] as Array<Option<T>>,
        )
        const selectedOption = flattenOptions.find((option) => option.value === e.target.value)

        if (selectedOption) {
          onChangeValue(selectedOption.value)
        }
      }
    },
    [onChange, onChangeValue, options],
  )

  const classNames = useMemo(() => {
    const { wrapper, select, iconWrap, blankOptgroup } = classNameGenerator()
    const sizeProps = {
      size: size || 'default',
    }

    return {
      wrapper: wrapper({ className }),
      select: select(sizeProps),
      iconWrap: iconWrap(sizeProps),
      blankOptGroup: blankOptgroup(),
    }
  }, [className, size])
  const wrapperStyle = useMemo(
    () => ({
      width: typeof width === 'number' ? `${width}px` : width,
    }),
    [width],
  )
  const decoratorDefaultTexts = useMemo(
    () => ({
      blankLabel: localize({
        id: 'smarthr-ui/Select/blankLabel',
        defaultText: '選択してください',
      }),
    }),
    [localize],
  )

  const decorated = useDecorators<DecoratorKeyTypes>(decoratorDefaultTexts, decorators)

  return (
    <span className={classNames.wrapper} style={wrapperStyle}>
      <select
        {...rest}
        data-smarthr-ui-input="true"
        onChange={handleChange}
        aria-invalid={error || undefined}
        disabled={disabled}
        // HINT: required属性を設定すると、iOS端末で以下の問題が発生します
        //  - フォームのsubmit時にバリデーションは行われるが、ユーザーにフィードバックがない
        //    - エラーメッセージが表示されない
        //    - 問題のある入力フィールドまでスクロールしない
        // 歴史的に一部の端末ではrequired属性が無視されることがあるため、HTMLのバリデーションのみとすることは少ないです
        // そのため、iOS端末ではrequired属性を設定しない方がユーザーがsubmitできない理由をエラーメッセージなどで正しく理解できるようになります
        required={isIOS ? undefined : required}
        ref={ref}
        className={classNames.select}
      >
        <BlankOption hasBlank={hasBlank}>{decorated.blankLabel}</BlankOption>
        {options.map((option, index) => (
          <Option {...option} key={index} />
        ))}
        <NotOmittingLabelsInMobileSafari className={classNames.blankOptGroup} />
      </select>
      <span className={classNames.iconWrap}>
        <FaAngleDownIcon />
      </span>
    </span>
  )
}

const BlankOption = memo<
  PropsWithChildren<{
    hasBlank: boolean | undefined
  }>
>(({ hasBlank, children }) => hasBlank && <option value="">{children}</option>)

const Option = memo<Props<string>['options'][number]>((option) => {
  if ('value' in option) {
    return <option {...option}>{option.label}</option>
  }

  const { options: groupedOptions, label, ...rest } = option

  return (
    <optgroup {...rest} key={label} label={label}>
      {groupedOptions.map((groupedOption) => (
        <option {...groupedOption} key={groupedOption.value}>
          {groupedOption.label}
        </option>
      ))}
    </optgroup>
  )
})

// Support for not omitting labels in Mobile Safari
const NotOmittingLabelsInMobileSafari = memo<{ className: string }>(
  ({ className }) => isMobileSafari && <optgroup className={className} />,
)

export const Select = genericsForwardRef(ActualSelect)
