'use client'

import {
  type ComponentProps,
  type FocusEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { Input } from '../Input'

import { formatCurrency } from './currencyInputHelper'

type Props = Omit<ComponentProps<typeof Input>, 'type' | 'value' | 'defaultValue'> & {
  /** 通貨の値 */
  value?: string
  /** デフォルトで表示する通貨の値 */
  defaultValue?: string
  /** 入力値がフォーマットされたときに発火するコールバック関数 */
  onFormatValue?: (value: string) => void
}

export const CurrencyInput = forwardRef<HTMLInputElement, Props>(
  ({ onFormatValue, onFocus, onBlur, value, defaultValue, className = '', ...rest }, ref) => {
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

        onFormatValue?.(formatted)
      },
      [onFormatValue],
    )

    useEffect(() => {
      if (value === undefined && defaultValue !== undefined) {
        formatValue(formatCurrency(defaultValue))
      }
      // when component did mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      if (!isFocused) {
        if (value !== undefined) {
          // for controlled component
          formatValue(formatCurrency(value))
        } else if (innerRef.current) {
          // for uncontrolled component
          formatValue(formatCurrency(innerRef.current.value))
        }
      }
    }, [isFocused, value, formatValue])

    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)

        if (innerRef.current) {
          const commaExcluded = innerRef.current.value.replace(/,/g, '')
          formatValue(commaExcluded)
        }

        onFocus?.(e)
      },
      [formatValue, onFocus],
    )

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)

        onBlur?.(e)
      },
      [onBlur],
    )

    return (
      <Input
        {...rest}
        type="text"
        value={value}
        defaultValue={defaultValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={innerRef}
        className={`smarthr-ui-CurrencyInput${className ? ` ${className}` : ''}`}
      />
    )
  },
)
