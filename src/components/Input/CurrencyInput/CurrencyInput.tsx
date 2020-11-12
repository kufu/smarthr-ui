import React, {
  FocusEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { Input, Props as InputProps } from '../Input'

type Props = Omit<InputProps, 'type' | 'value' | 'defaultValue'> & {
  value?: string
  defaultValue?: string
  onFormatValue?: (value: string) => void
}

export const CurrencyInput = forwardRef<HTMLInputElement, Props>(
  ({ onFormatValue, onFocus, onBlur, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current,
    )

    const formatValue = useCallback(
      (formatted = '') => {
        if (!innerRef.current || formatted === innerRef.current.value) {
          return
        }
        innerRef.current.value = formatted
        onFormatValue && onFormatValue(formatted)
      },
      [onFormatValue],
    )

    useEffect(() => {
      if (props.value === undefined && props.defaultValue !== undefined) {
        formatValue(formatCurrency(props.defaultValue))
      }
      // when component did mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (!isFocused) {
        if (props.value !== undefined) {
          // for controlled component
          formatValue(formatCurrency(props.value))
        } else if (innerRef.current) {
          // for uncontrolled component
          formatValue(formatCurrency(innerRef.current.value))
        }
      }
    }, [isFocused, props.value, formatValue])

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (innerRef.current) {
        const commaExcluded = innerRef.current.value.replace(/,/g, '')
        formatValue(commaExcluded)
      }
      onFocus && onFocus(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur && onBlur(e)
    }

    return <Input type="text" onFocus={handleFocus} onBlur={handleBlur} ref={innerRef} {...props} />
  },
)

function formatCurrency(value?: string) {
  if (!value) {
    return ''
  }
  const converted = value
    .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
    .replace(/[−ー]/, '-') // replace full-width minus
  const nonNumericRegExp = /[^0-9.-]/g
  if (converted.match(nonNumericRegExp) || isNaN(Number(converted))) {
    // if value includes non-numeric characters, return value as it is
    return value
  }
  const numeric = converted.replace(nonNumericRegExp, '') // exclude non-numeric characters
  const splited = numeric.split('.')
  const [integerPart, decimalPart] = splited
  const commaed = integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits
  if (!decimalPart) {
    return commaed
  }
  const excludedEndZero = decimalPart.replace(/0+$/, '')
  if (excludedEndZero.length === 0) {
    return commaed
  }
  return [commaed, excludedEndZero].join('.')
}
