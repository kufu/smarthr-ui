'use client'

import {
  type ComponentProps,
  type FocusEvent,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useOnce } from '../../../hooks/client/useOnce'
import { useLatest } from '../../../hooks/useLatest'
import { useMergeRefs } from '../../../hooks/useMergeRefs'
import { formatNumericString } from '../../../libs/formatNumericString'
import { Input } from '../Input'

type Props = Omit<ComponentProps<typeof Input>, 'type' | 'value' | 'defaultValue'> & {
  /** 通貨の値 */
  value?: string
  /** デフォルトで表示する通貨の値 */
  defaultValue?: string
  /** 入力値がフォーマットされたときに発火するコールバック関数 */
  onFormatValue?: (value: string) => void
}

export const CurrencyInput = forwardRef<HTMLInputElement, Props>(
  ({ onFormatValue, onFocus, onBlur, value, defaultValue, className, ...rest }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    const latest = useLatest({
      onFocus,
      onBlur,
      onFormatValue,
      value,
      defaultValue,
    })

    const functions = useMemo(() => {
      const formatValue = (formatted = '') => {
        if (innerRef.current && formatted !== innerRef.current.value) {
          innerRef.current.value = formatted
          latest.onFormatValue?.(formatted)
        }
      }
      const formatCurrencyValue = (raw = '') => {
        formatValue(formatNumericString(raw))
      }

      return {
        baseCallbackRef: (node: HTMLInputElement | null) => {
          if (node && latest.value === undefined && latest.defaultValue !== undefined) {
            formatCurrencyValue(latest.defaultValue)
          }
        },
        formatCurrencyValue,
        handleFocus: (e: FocusEvent<HTMLInputElement>) => {
          setIsFocused(true)
          formatValue(e.currentTarget.value.replace(/,/g, ''))

          latest.onFocus?.(e)
        },
        handleBlur: (e: FocusEvent<HTMLInputElement>) => {
          setIsFocused(false)

          latest.onBlur?.(e)
        },
      }
    }, [latest])

    const callbackRef = useOnce(functions.baseCallbackRef)
    const mergedRef = useMergeRefs(innerRef, callbackRef, ref)

    useEffect(() => {
      if (!isFocused) {
        if (value !== undefined) {
          // for controlled component
          functions.formatCurrencyValue(value)
        } else if (innerRef.current) {
          // for uncontrolled component
          functions.formatCurrencyValue(innerRef.current.value)
        }
      }
    }, [isFocused, value, functions])

    return (
      <Input
        {...rest}
        ref={mergedRef}
        type="text"
        value={value}
        defaultValue={defaultValue}
        className={`smarthr-ui-CurrencyInput${className ? ` ${className}` : ''}`}
        onFocus={functions.handleFocus}
        onBlur={functions.handleBlur}
      />
    )
  },
)
