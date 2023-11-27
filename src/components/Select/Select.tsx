import React, {
  ChangeEvent,
  ComponentPropsWithoutRef,
  ForwardedRef,
  forwardRef,
  useCallback,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { isMobileSafari } from '../../libs/ua'
import { FaSortIcon } from '../Icon'

import type { DecoratorsType } from '../../types'

type Option<T extends string> = {
  value: T
} & Omit<React.OptionHTMLAttributes<HTMLOptionElement>, 'value'>
type Optgroup<T extends string> = {
  label: string
  options: Array<Option<T>>
} & React.OptgroupHTMLAttributes<HTMLOptGroupElement>

type Props<T extends string> = {
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
  decorators?: DecoratorsType<'blankLabel'>
}

type ElementProps = Omit<ComponentPropsWithoutRef<'select'>, keyof Props<string> | 'children'>

const BLANK_LABEL = '選択してください'

const select = tv({
  slots: {
    wrapper: 'smarthr-ui-Select shr-relative shr-inline-block',
    selectEl: [
      'shr-peer shr-w-full shr-cursor-pointer shr-appearance-none shr-rounded-m shr-border shr-border-solid shr-bg-white shr-text-base shr-leading-none shr-text-black shr-outline-none',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-focus-indicator',
      'disabled:shr-pointer-events-none disabled:shr-bg-white-darken disabled:shr-text-disabled disabled:shr-opacity-100',
      'contrast-more:shr-border-r-highContrast',
      /* padding に依る積み上げでは文字が見切れてしまうため */
      'shr-min-h-[calc(theme(fontSize.base)_+_theme(spacing[0.75])_*_2_+_theme(spacing.px)_*_2)]',
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
        selectEl: 'shr-py-0.75 shr-pe-2 shr-ps-0.5',
        iconWrap: 'shr-end-0.75',
      },
      s: {
        selectEl: [
          'shr-px-0.5 shr-py-0.5 shr-text-sm',
          /* padding に依る積み上げでは文字が見切れてしまうため */
          'shr-min-h-[calc(theme(fontSize.sm)_+_theme(spacing[0.5])_*_2_+_theme(spacing.px)_*_2)]',
        ],
        iconWrap: 'shr-end-0.5 shr-text-sm',
      },
    },
    error: {
      true: {
        selectEl: 'shr-border-danger',
      },
      false: {
        selectEl: 'shr-border-default disabled:shr-border-disabled',
      },
    },
  },
})

function SelectComponent<T extends string>(
  {
    options,
    onChange,
    onChangeValue,
    error = false,
    width = 'auto',
    hasBlank = false,
    decorators,
    size = 'default',
    className,
    disabled,
    ...props
  }: Props<T> & ElementProps,
  ref: ForwardedRef<HTMLSelectElement>,
) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      if (onChange) onChange(e)
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

  const { wrapperStyleProps, selectStyle, iconWrapStyle, blankOptGroupStyle } = useMemo(() => {
    const { wrapper, selectEl, iconWrap, blankOptgroup } = select()
    return {
      wrapperStyleProps: {
        className: wrapper({ className }),
        style: {
          width: typeof width === 'number' ? `${width}px` : width,
        },
      },
      selectStyle: selectEl({ error, size }),
      iconWrapStyle: iconWrap({ size }),
      blankOptGroupStyle: blankOptgroup(),
    }
  }, [className, error, size, width])

  return (
    <span {...wrapperStyleProps}>
      {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
      <select
        {...props}
        onChange={handleChange}
        aria-invalid={error || undefined}
        disabled={disabled}
        ref={ref}
        className={selectStyle}
      >
        {hasBlank && (
          <option value="">{decorators?.blankLabel?.(BLANK_LABEL) || BLANK_LABEL}</option>
        )}
        {options.map((option) => {
          if ('value' in option) {
            return (
              <option {...option} key={option.value}>
                {option.label}
              </option>
            )
          }

          const { options: groupedOptions, ...optgroup } = option

          return (
            <optgroup {...optgroup} key={optgroup.label}>
              {groupedOptions.map((groupedOption) => (
                <option {...groupedOption} key={groupedOption.value}>
                  {groupedOption.label}
                </option>
              ))}
            </optgroup>
          )
        })}
        {
          // Support for not omitting labels in Mobile Safari
          isMobileSafari && <optgroup className={blankOptGroupStyle} />
        }
      </select>
      <span className={iconWrapStyle}>
        <FaSortIcon />
      </span>
    </span>
  )
}

// forwardRef したコンポーネントでジェネリクスを使うときのワークアラウンド
// https://stackoverflow.com/questions/58469229/react-with-typescript-generics-while-using-react-forwardref/58473012
export const Select = forwardRef(SelectComponent) as (<T extends string>(
  props: ComponentPropsWithoutRef<typeof SelectComponent<T>> & {
    ref?: ForwardedRef<HTMLSelectElement>
  },
) => ReturnType<typeof SelectComponent<T>>) & { displayName?: string }
