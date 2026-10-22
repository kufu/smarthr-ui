'use client'

import { type ComponentPropsWithRef, type FC, useCallback } from 'react'

import { useLatest } from '../../../../hooks/useLatest'
import { useIntl } from '../../../../intl'

import { DatePicker } from './DatePicker'

import type { ExtendProps } from '../../../../types'

type DatePickerProps = ComponentPropsWithRef<typeof DatePicker>
type Props = ExtendProps<
  DatePickerProps,
  { showAlternative?: boolean | DatePickerProps['showAlternative'] }
>

export const WarekiPicker: FC<Props> = ({ showAlternative, ...rest }) => {
  const { locale } = useIntl()
  const latest = useLatest({ showAlternative, locale })

  // HINT: showAlternativeの値によってDatePicker/別コンポーネントを出し分けると、
  // Reactがコンポーネント型の変化とみなして再マウントし、非制御input使用時に
  // 入力値・フォーカスが失われる。常に同じDatePickerへ、解決済みの関数を渡す
  const resolveAlternative = useCallback(
    (date: Date | null) => {
      if (typeof latest.showAlternative === 'function') {
        return latest.showAlternative(date)
      }

      if (!date) {
        return null
      }

      // 和暦を使う(showAlternativeが未指定、またはtrueの場合のデフォルト)
      return date.toLocaleDateString(`${latest.locale}-u-ca-japanese`, {
        dateStyle: 'long',
      })
    },
    [latest],
  )

  // HINT: DatePicker はshowAlternativeがfalsyな場合、即座に別表記を非表示にする。
  // showAlternativeがfalseの間はundefinedを渡すことで、選択日が変わらないまま
  // true→falseに切り替えても以前の別表記が残らないようにする
  return (
    <DatePicker
      {...rest}
      showAlternative={showAlternative === false ? undefined : resolveAlternative}
    />
  )
}
