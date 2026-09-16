import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  type PropsWithChildren,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { genericsForwardRef } from '../../libs/util'
import { FaAngleDownIcon } from '../Icon'

import { ActualSelect, NotOmittingLabelsInMobileSafari } from './client'

import type { ActualSelectProps } from './client'

type BaseProps<T extends string> = Omit<ActualSelectProps<T>, 'outerRef' | 'children'> & {
  /** コンポーネントの幅 */
  width?: number | string
  /** コンポーネントの大きさ */
  size?: 'M' | 'S'
  /** 空の選択肢を表示するかどうか */
  hasBlank?: boolean
  /** 空の選択肢のラベル */
  blankLabel?: string
}

type Props<T extends string> = BaseProps<T> &
  Omit<ComponentPropsWithoutRef<'select'>, keyof BaseProps<string> | 'children'>

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
  },
  variants: {
    size: {
      M: {
        select: 'shr-py-0.5 shr-pe-2 shr-ps-0.5',
        // ((右 padding - アイコン幅) / 2) + 右 border
        iconWrap: 'shr-end-[calc(theme(spacing[0.5])_+_theme(spacing.px))]',
      },
      S: {
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

const BaseSelect = <T extends string>(
  { options, width, hasBlank, blankLabel, size, className, ...rest }: Props<T>,
  ref: ForwardedRef<HTMLSelectElement>,
) => {
  const classNames = useMemo(() => {
    const { wrapper, select, iconWrap } = classNameGenerator()
    const sizeProps = {
      size: size || 'M',
    }

    return {
      wrapper: wrapper({ className }),
      select: select(sizeProps),
      iconWrap: iconWrap(sizeProps),
    }
  }, [size, className])

  return (
    <span
      className={classNames.wrapper}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
      }}
    >
      <ActualSelect {...rest} outerRef={ref} className={classNames.select} options={options}>
        <BlankOption hasBlank={hasBlank}>{blankLabel ?? ''}</BlankOption>
        {options.map((option, index) => (
          <Option {...option} key={index} />
        ))}
        <NotOmittingLabelsInMobileSafari />
      </ActualSelect>
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

export const Select = genericsForwardRef(BaseSelect)
