import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { UnstyledButton } from '../Button'

type AbstractProps = {
  /** 選択された年 */
  selectedYear?: number
  /** 選択可能な開始年 */
  fromYear: number
  /** 選択可能な終了年 */
  toYear: number
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectYear: (e: MouseEvent<HTMLButtonElement>) => void
  /** 表示フラグ */
  isDisplayed: boolean
  /** HTMLのid属性 */
  id: string
}
type ElementProps = Omit<ComponentProps<'div'>, keyof AbstractProps>
type Props = AbstractProps & ElementProps
type ActualProps = Omit<Props, 'isDisplayed'>

const classNameGenerator = tv({
  slots: {
    overlay: 'smarthr-ui-YearPicker shr-absolute shr-inset-0 shr-bg-white',
    container:
      'shr-overflow-y-auto shr-box-border shr-flex shr-h-full shr-w-full shr-flex-wrap shr-items-start shr-px-0.25 shr-py-0.5',
    yearButton:
      'smarthr-ui-YearPicker-selectYear shr-group shr-flex shr-w-1/4 shr-items-center shr-justify-center shr-px-0 shr-py-0.5 shr-leading-none focus-visible:shr-outline-none',
    yearWrapper: [
      'shr-box-border shr-inline-block shr-rounded-full shr-px-0.75 shr-py-0.5 shr-text-base shr-leading-none group-focus-visible:shr-focus-indicator group-hover:shr-bg-base-grey group-hover:shr-text-black',
      '[[data-this-year="true"]>&]:shr-border-shorthand',
      '[[aria-pressed="true"]>&]:shr-bg-main [[aria-pressed="true"]>&]:shr-text-white',
    ],
  },
})

export const YearPicker: FC<Props & ElementProps> = ({ isDisplayed, ...rest }) =>
  isDisplayed ? <ActualYearPicker {...rest} /> : null

const ActualYearPicker: FC<ActualProps> = ({
  selectedYear,
  fromYear,
  toYear,
  onSelectYear,
  id,
  ...props
}) => {
  const classNames = useMemo(() => {
    const { overlay, container, yearButton, yearWrapper } = classNameGenerator()

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
    const result: number[] = []

    for (let i = 0; i < length; i++) {
      result[i] = fromYear + i
    }

    return result
  }, [toYear, fromYear])

  useEffect(() => {
    if (focusingRef.current) {
      // HINT: 現在の年に一度focusを当てることでtab移動をしやすくする
      // focusを当てたままでは違和感があるため、blurで解除している
      focusingRef.current.focus()
      focusingRef.current.blur()
    }
  }, [])

  return (
    <div {...props} id={id} className={classNames.overlay}>
      <div className={classNames.container}>
        {yearArray.map((year) => (
          <YearButton
            key={year}
            year={year}
            thisYear={thisYear}
            selected={selectedYear === year}
            focusingRef={focusingRef}
            className={classNames.yearButton}
            childrenStyle={classNames.yearWrapper}
            onClick={onSelectYear}
          />
        ))}
      </div>
    </div>
  )
}

const YearButton = memo<{
  year: number
  thisYear: number
  selected: boolean
  focusingRef: RefObject<HTMLButtonElement>
  className: string
  childrenStyle: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}>(({ year, thisYear, selected, focusingRef, onClick, className, childrenStyle }) => {
  const { localize } = useIntl()
  const isThisYear = thisYear === year

  return (
    <UnstyledButton
      ref={isThisYear ? focusingRef : null}
      value={year}
      aria-pressed={selected}
      onClick={onClick}
      className={className}
      data-this-year={isThisYear}
      aria-label={
        isThisYear
          ? localize({
              id: 'smarthr-ui/Calendar/currentYear',
              defaultText: '現在の年',
            })
          : undefined
      }
    >
      <span className={childrenStyle}>{year}</span>
    </UnstyledButton>
  )
})
