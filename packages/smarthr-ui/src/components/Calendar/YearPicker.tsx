import { type ComponentProps, type FC, type MouseEvent, memo, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { UnstyledButton } from '../Button'
import { Scroller } from '../Scroller'

type BaseProps = {
  /** 選択された年 */
  selectedYear?: number
  /** 選択可能な開始年 */
  fromYear: number
  /** 選択可能な終了年 */
  toYear: number
  /** トリガのセレクトイベントを処理するハンドラ */
  handleSelectYear: (e: MouseEvent<HTMLButtonElement>) => void
  /** 表示フラグ */
  isDisplayed: boolean
  /** HTMLのid属性 */
  id: string
}
type Props = BaseProps & Omit<ComponentProps<'div'>, keyof BaseProps>
type ActualProps = Omit<Props, 'isDisplayed'>

const classNameGenerator = tv({
  slots: {
    overlay: 'smarthr-ui-YearPicker shr-absolute shr-inset-0 shr-bg-white',
    container:
      'shr-box-border shr-flex shr-h-full shr-w-full shr-flex-wrap shr-items-start shr-px-0.25 shr-py-0.5',
    yearButton:
      'smarthr-ui-YearPicker-selectYear shr-group shr-flex shr-w-1/4 shr-items-center shr-justify-center shr-px-0 shr-py-0.5 shr-leading-none',
    yearWrapper: [
      'shr-box-border shr-inline-block shr-rounded-full shr-px-0.75 shr-py-0.5 shr-text-base shr-leading-none group-hover:shr-bg-base-grey group-hover:shr-text-black',
      '[[data-this-year="true"]>&]:shr-border-shorthand',
      '[[aria-pressed="true"]>&]:shr-bg-main [[aria-pressed="true"]>&]:shr-text-white',
    ],
  },
})

const CLASS_NAMES = (() => {
  const { overlay, container, yearButton, yearWrapper } = classNameGenerator()

  return {
    overlay: overlay(),
    container: container(),
    yearButton: yearButton(),
    yearWrapper: yearWrapper(),
  }
})()

const FOCUS_CALLBACK_REF = (node: HTMLButtonElement | null) => {
  if (node) {
    // HINT: 現在の年に一度focusを当てることでtab移動をしやすくする
    // focusを当てたままでは違和感があるため、blurで解除している
    node.focus()
    node.blur()
  }
}

export const YearPicker: FC<Props> = ({ isDisplayed, ...rest }) =>
  isDisplayed ? <ActualYearPicker {...rest} /> : null

const ActualYearPicker: FC<ActualProps> = ({
  selectedYear,
  fromYear,
  toYear,
  handleSelectYear,
  id,
  ...rest
}) => {
  const [thisYear] = useState(() => new Date().getFullYear())
  const yearArray = useMemo(() => {
    const length = Math.max(Math.min(toYear, 9999) - fromYear + 1, 0)
    const result: number[] = []

    for (let i = 0; i < length; i++) {
      result[i] = fromYear + i
    }

    return result
  }, [toYear, fromYear])

  return (
    <div {...rest} id={id} className={CLASS_NAMES.overlay}>
      <Scroller className={CLASS_NAMES.container}>
        {yearArray.map((year) => (
          <YearButton
            key={year}
            selected={selectedYear === year}
            year={year}
            thisYear={thisYear}
            handleClick={handleSelectYear}
          />
        ))}
      </Scroller>
    </div>
  )
}

const YearButton = memo<{
  year: number
  thisYear: number
  selected: boolean
  handleClick: (e: MouseEvent<HTMLButtonElement>) => void
}>(({ year, thisYear, selected, handleClick }) => {
  const { localize } = useIntl()
  const isThisYear = thisYear === year

  return (
    <UnstyledButton
      ref={isThisYear ? FOCUS_CALLBACK_REF : null}
      value={year}
      className={CLASS_NAMES.yearButton}
      aria-pressed={selected}
      aria-label={
        isThisYear
          ? localize({
              id: 'smarthr-ui/Calendar/currentYear',
              defaultText: '現在の年',
            })
          : undefined
      }
      data-this-year={isThisYear}
      onClick={handleClick}
    >
      <span className={CLASS_NAMES.yearWrapper}>{year}</span>
    </UnstyledButton>
  )
})
