'use client'

import {
  type ComponentProps,
  type FocusEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from '../../../hooks/useLatest'
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
    const [actualDefaultValue] = useState(() =>
      defaultValue !== undefined ? formatCurrency(defaultValue) : defaultValue,
    )

    const latest = useLatest({
      onFocus,
      onBlur,
      onFormatValue,
    })

    const functions = useMemo(() => {
      const formatValue = (formatted = '') => {
        if (innerRef.current && formatted !== innerRef.current.value) {
          innerRef.current.value = formatted
          latest.onFormatValue?.(formatted)
        }
      }

      return {
        formatCurrencyValue: (raw = '') => {
          formatValue(formatCurrency(raw))
        },
        handleFocus: (e: FocusEvent<HTMLInputElement>) => {
          setIsFocused(true)

          if (innerRef.current) {
            const commaExcluded = innerRef.current.value.replace(/,/g, '')
            formatValue(commaExcluded)
          }

          latest.onFocus?.(e)
        },
        handleBlur: (e: FocusEvent<HTMLInputElement>) => {
          setIsFocused(false)

          latest.onBlur?.(e)
        },
      }
    }, [latest])

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current,
    )

    useEffect(() => {
      if (!isFocused && innerRef.current) {
        functions.formatCurrencyValue(innerRef.current.value)
      }
    }, [value, isFocused, functions])

    return (
      <Input
        {...rest}
        ref={innerRef}
        type="text"
        value={value}
        defaultValue={actualDefaultValue}
        onFocus={functions.handleFocus}
        onBlur={functions.handleBlur}
        className={`smarthr-ui-CurrencyInput${className ? ` ${className}` : ''}`}
      />
    )
  },
)
