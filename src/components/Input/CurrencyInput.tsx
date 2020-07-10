import React, { ChangeEvent, FC, FocusEvent, useCallback, useEffect, useState } from 'react'

import { Input, Props as InputProps } from './Input'

type Props = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & {
  value?: string
  onChangeValue?: (value: string) => void
}

export const CurrencyInput: FC<Props> = ({
  value,
  onChangeValue,
  onChange,
  onFocus,
  onBlur,
  ...props
}) => {
  const [controlledValue, setControlledValue] = useState(value || '')
  const [isFocused, setIsFocused] = useState(false)

  const changeValue = useCallback(
    (changed = '') => {
      if (changed === controlledValue) {
        return
      }
      setControlledValue(changed)
      onChangeValue && onChangeValue(changed)
    },
    [controlledValue, onChangeValue],
  )

  useEffect(() => {
    if (isFocused) {
      setControlledValue(value || '')
    } else {
      changeValue(convertToCurrency(value))
    }
  }, [isFocused, value, controlledValue, changeValue])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    changeValue(e.target.value)
    onChange && onChange(e)
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    const commaExcluded = controlledValue.replace(/,/g, '')
    changeValue(commaExcluded)
    onFocus && onFocus(e)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    changeValue(convertToCurrency(controlledValue))
    onBlur && onBlur(e)
  }

  return (
    <Input
      type="text"
      value={controlledValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  )
}

function convertToCurrency(value?: string) {
  if (!value) {
    return ''
  }
  const shaped = value
    .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
    .replace(/[−ー]/, '-') // replace full-width minus
    // .replace(/[^0-9.-]|(?!^)-|^\.+|\.+$/g, '') // exclude non-numeric characters
    .replace(/[^0-9.-]/g, '') // exclude non-numeric characters
  const splited = shaped.split('.')
  const integerPart = splited[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits
  const formattedArray = Object.assign(splited, [integerPart])
  return formattedArray.join('.')
}
