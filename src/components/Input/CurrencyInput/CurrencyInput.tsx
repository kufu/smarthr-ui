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
    }, [isFocused])

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
  const shaped = value
    .replace(/[０-９．]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // convert number and dot to half-width
    .replace(/[−ー]/, '-') // replace full-width minus
    .replace(/[^0-9.-]/g, '') // exclude non-numeric characters
  const splited = shaped.split('.')
  const integerPart = splited[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') // add comma to integer every 3 digits
  const formattedArray = Object.assign(splited, [integerPart])
  return formattedArray.join('.')
}
