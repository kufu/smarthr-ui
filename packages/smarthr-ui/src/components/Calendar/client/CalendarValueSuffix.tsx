'use client'

import { type ComponentPropsWithRef, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { FaCalendarDaysIcon } from '../../Icon'

const classNameGenerator = tv({
  slots: {
    layout: 'shr-box-border shr-h-full shr-py-0.5',
    wrapper:
      'shr-border-l-shorthand shr-box-border shr-flex shr-h-full shr-items-center shr-justify-center shr-ps-0.5 shr-text-base',
    text: 'shr-text-gray shr-me-0.5 shr-text-sm',
  },
})

type Props = {
  alternativeFormat: null | ReactNode
  caretIconColor: ComponentPropsWithRef<typeof FaCalendarDaysIcon>['color']
}

/** 日付入力系コンポーネント(DatePicker/Input[type=date])のsuffixに表示する、カレンダーアイコン＋別表記フォーマットの組み合わせ */
export const CalendarValueSuffix = memo<Props>(({ alternativeFormat, caretIconColor }) => {
  const { layout, wrapper, text } = classNameGenerator()

  return (
    <span className={layout()}>
      <span className={wrapper()}>
        {alternativeFormat && <span className={text()}>{alternativeFormat}</span>}
        <FaCalendarDaysIcon color={caretIconColor} />
      </span>
    </span>
  )
})
