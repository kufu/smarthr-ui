import React, { ComponentProps, FC, useEffect, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'

import { UnstyledButton } from '../Button'

type Props = {
  /** 選択された年 */
  selectedYear?: number
  /** 選択可能な開始年 */
  fromYear: number
  /** 選択可能な終了年 */
  toYear: number
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectYear: (year: number) => void
  /** 表示フラグ */
  isDisplayed: boolean
  /** HTMLのid属性 */
  id: string
}
type ElementProps = Omit<ComponentProps<'div'>, keyof Props>

const yearPicker = tv({
  slots: {
    overlay: 'smarthr-ui-YearPicker shr-absolute shr-inset-0 shr-bg-white',
    container:
      'shr-box-border shr-flex shr-h-full shr-w-full shr-flex-wrap shr-items-start shr-overflow-y-auto shr-px-0.25 shr-py-0.5',
    yearButton:
      'smarthr-ui-YearPicker-selectYear shr-group shr-flex shr-w-1/4 shr-items-center shr-justify-center shr-px-0 shr-py-0.5 shr-leading-none',
    yearWrapper:
      'shr-box-border shr-inline-block shr-rounded-full shr-px-0.75 shr-py-0.5 shr-text-base shr-leading-none group-hover:shr-bg-base-grey group-hover:shr-text-black',
  },
  variants: {
    isDisplayed: {
      false: {
        overlay: 'shr-hidden',
      },
    },
    isThisYear: {
      true: {
        yearWrapper: 'shr-border-shorthand',
      },
    },
    isSelected: {
      true: {
        yearWrapper: 'shr-bg-main shr-text-white',
      },
    },
  },
})

export const YearPicker: FC<Props & ElementProps> = ({
  selectedYear,
  fromYear,
  toYear,
  onSelectYear,
  isDisplayed,
  id,
  ...props
}) => {
  const { overlay, container, yearButton, yearWrapper } = yearPicker()
  const { overlayStyle, containerStyle, yearButtonStyle } = useMemo(
    () => ({
      overlayStyle: overlay({ isDisplayed }),
      containerStyle: container(),
      yearButtonStyle: yearButton(),
    }),
    [container, isDisplayed, overlay, yearButton],
  )
  const focusingRef = useRef<HTMLButtonElement>(null)

  const thisYear = new Date().getFullYear()
  const numOfYear = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0)
  const yearArray = Array(numOfYear)
    .fill(null)
    .map((_, i) => fromYear + i)

  useEffect(() => {
    if (focusingRef.current && isDisplayed) {
      focusingRef.current.focus()
      focusingRef.current.blur()
    }
  }, [isDisplayed])

  return (
    <div {...props} id={id} className={overlayStyle}>
      <div className={containerStyle}>
        {yearArray.map((year) => {
          const isThisYear = thisYear === year
          const isSelectedYear = selectedYear === year
          return (
            <UnstyledButton
              key={year}
              onClick={() => onSelectYear(year)}
              aria-pressed={isSelectedYear}
              ref={isThisYear ? focusingRef : null}
              className={yearButtonStyle}
            >
              <span className={yearWrapper({ isThisYear, isSelected: isSelectedYear })}>
                {year}
              </span>
            </UnstyledButton>
          )
        })}
      </div>
    </div>
  )
}
