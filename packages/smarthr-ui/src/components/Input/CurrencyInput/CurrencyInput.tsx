'use client'

import React, {
  FocusEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { Input } from '../Input'

import { formatCurrency } from './currencyInputHelper'
import { useClassNames } from './useClassNames'

type Props = Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'defaultValue'> & {
  /** 通貨の値 */
  value?: string
  /** デフォルトで表示する通貨の値 */
  defaultValue?: string
  /** 入力値がフォーマットされたときに発火するコールバック関数 */
  onFormatValue?: (value: string) => void
}

export const CurrencyInput = forwardRef<HTMLInputElement, Props>(
  ({ onFormatValue, onFocus, onBlur, className = '', ...props }, ref) => {
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

        if (onFormatValue) {
          onFormatValue(formatted)
        }
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

      if (onFocus) {
        onFocus(e)
      }
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)

      if (onBlur) {
        onBlur(e)
      }
    }

    const classNames = useClassNames()

    return (
      <Input
        {...props}
        type="text"
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={innerRef}
        className={`${className} ${classNames.wrapper}`}
      />
    )
  },
)
