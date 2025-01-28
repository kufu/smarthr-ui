import React, {
  ComponentProps,
  FC,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
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
    overlay:
      'smarthr-ui-YearPicker shr-absolute shr-inset-0 shr-bg-white [[data-displayed="true"]>&]:shr-hidden',
    container:
      'shr-box-border shr-flex shr-h-full shr-w-full shr-flex-wrap shr-items-start shr-overflow-y-auto shr-px-0.25 shr-py-0.5',
    yearButton:
      'smarthr-ui-YearPicker-selectYear shr-group shr-flex shr-w-1/4 shr-items-center shr-justify-center shr-px-0 shr-py-0.5 shr-leading-none',
    yearWrapper: [
      'shr-box-border shr-inline-block shr-rounded-full shr-px-0.75 shr-py-0.5 shr-text-base shr-leading-none group-hover:shr-bg-base-grey group-hover:shr-text-black',
      '[[data-this-year="true"]>&]:shr-border-shorthand',
      '[[aria-pressed="true"]>&]:shr-bg-main [[aria-pressed="true"]>&]:shr-text-white',
    ],
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
  const styles = useMemo(() => {
    const { overlay, container, yearButton, yearWrapper } = yearPicker()

    return {
      overlay: overlay(),
      container: container(),
      yearButton: yearButton(),
      yearWrapper: yearWrapper(),
    }
  }, [])
  const focusingRef = useRef<HTMLButtonElement>(null)

  const thisYear = useMemo(() => new Date().getFullYear(), [])
  const yearArray = useMemo(() => {
    const length = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0)
    let result: number[] = []

    for (let i = 0; i < length; i++) {
      result[i] = fromYear + i
    }

    return result
  }, [toYear, fromYear])

  useEffect(() => {
    if (focusingRef.current && isDisplayed) {
      // HINT: 現在の年に一度focusを当てることでtab移動をしやすくする
      // focusを当てたままでは違和感があるため、blurで解除している
      focusingRef.current.focus()
      focusingRef.current.blur()
    }
  }, [isDisplayed])

  const onClickYear = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onSelectYear(parseInt(e.currentTarget.value, 10))
    },
    [onSelectYear],
  )

  return (
    <div {...props} id={id} data-displayed={isDisplayed} className={styles.overlay}>
      <div className={styles.container}>
        {yearArray.map((year) => (
          <YearButton
            year={year}
            thisYear={thisYear}
            selected={selectedYear === year}
            focusingRef={focusingRef}
            className={styles.yearButton}
            childrenStyle={styles.yearWrapper}
            onClick={onClickYear}
          />
        ))}
      </div>
    </div>
  )
}

const YearButton = React.memo<{
  year: number
  thisYear: number
  selected: boolean
  focusingRef: RefObject<HTMLButtonElement>
  className: string
  childrenStyle: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}>(({ year, thisYear, selected, focusingRef, onClick, className, childrenStyle }) => {
  const isThisYear = thisYear === year

  return (
    <UnstyledButton
      ref={isThisYear ? focusingRef : null}
      value={year}
      aria-pressed={selected}
      onClick={onClick}
      className={className}
      data-this-year={isThisYear}
    >
      <span className={childrenStyle}>{year}</span>
    </UnstyledButton>
  )
})
