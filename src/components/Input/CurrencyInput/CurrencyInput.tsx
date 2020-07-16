import React, { FC, FocusEvent, useCallback, useEffect, useRef, useState } from 'react'

import { Input, Props as InputProps } from '../Input'

type Props = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & {
  value?: string
  defaultValue?: string
  onFormatValue?: (value: string) => void
}

export const CurrencyInput: FC<Props> = ({ onFormatValue, onFocus, onBlur, ...props }) => {
  const ref = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const formatValue = useCallback(
    (formatted = '') => {
      if (!ref.current || formatted === ref.current.value) {
        return
      }
      ref.current.value = formatted
      onFormatValue && onFormatValue(formatted)
    },
    [onFormatValue],
  )

  useEffect(() => {
    if (!isFocused && props.value !== undefined) {
      formatValue(formatCurrency(props.value))
    }
  }, [isFocused, props.value, formatValue])

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    if (ref.current) {
      const commaExcluded = ref.current.value.replace(/,/g, '')
      formatValue(commaExcluded)
    }
    onFocus && onFocus(e)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (ref.current) {
      formatValue(formatCurrency(ref.current.value))
    }
    onBlur && onBlur(e)
  }

  return <Input type="text" onFocus={handleFocus} onBlur={handleBlur} ref={ref} {...props} />
}

function formatCurrency(value?: string) {
  if (!value) {
    return ''
  }
  const shaped = value
    .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
    .replace(/[−ー]/, '-') // replace full-width minus
    .replace(/[^0-9.-]/g, '') // exclude non-numeric characters
  const splited = shaped.split('.')
  const integerPart = splited[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits
  const formattedArray = Object.assign(splited, [integerPart])
  return formattedArray.join('.')
}
