import React, { ChangeEvent, FC, FocusEvent, useState } from 'react'

import { Input, Props as InputProps } from './Input'

type Props = Omit<InputProps, 'type' | 'defaultValue'> & {
  value?: string
}

export const CurrencyInput: FC<Props> = ({ onChange, onFocus, onBlur, ...props }) => {
  const [value, setValue] = useState(props.value || '')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange && onChange(e)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const commaExcluded = value.replace(/,/g, '')
    setValue(commaExcluded)
    onFocus && onFocus(e)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const shaped = value
      .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
      .replace(/[−ー]/, '-') // replace full-width minus
      .replace(/[^0-9.-]|(?!^)-|^\.+|\.+$/g, '') // exclude non-numeric characters
    const splited = shaped.split('.')
    const integerPart = splited[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits
    const formattedArray = Object.assign(splited, [integerPart])
    setValue(formattedArray.join('.'))
    onBlur && onBlur(e)
  }

  return (
    <Input
      type="text"
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}
