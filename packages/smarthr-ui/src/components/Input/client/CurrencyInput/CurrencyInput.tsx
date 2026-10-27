'use client'

import { type FC, type FocusEvent, useEffect, useMemo, useRef, useState } from 'react'

import { useAnimationFrame } from '../../../../hooks/client/useAnimationFrame'
import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useOnce } from '../../../../hooks/client/useOnce'
import { useLatest } from '../../../../hooks/useLatest'
import { formatNumericString } from '../../../../libs/formatNumericString'
import { Input } from '../Input'

import type { ExtendElementPropsWithRef } from '../../../../types'

type Props = ExtendElementPropsWithRef<
  typeof Input,
  {
    /** 通貨の値 */
    value?: string
    /** デフォルトで表示する通貨の値 */
    defaultValue?: string
    /** 入力値がフォーマットされたときに発火するコールバック関数 */
    onFormatValue?: (value: string) => void
  },
  { omit: 'type' }
>

export const CurrencyInput: FC<Props> = ({
  onFormatValue,
  onFocus,
  onBlur,
  value,
  defaultValue,
  className,
  ref,
  ...rest
}) => {
  const innerRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const resetFrame = useAnimationFrame()

  const latest = useLatest({
    onFocus,
    onBlur,
    onFormatValue,
    value,
    defaultValue,
    resetFrame,
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

        const associatedForm = node?.form
        // HINT: 非制御時、form.reset()(React 19のaction成功時の自動resetを含む)で
        // ネイティブのdefaultValueへの復帰により失われるフォーマット(カンマ区切り等)をかけ直す。
        // resetイベントは実際に値がリセットされる前に発火するため、次のフレームで値を読み直す
        const handleReset = () => {
          if (latest.value === undefined) {
            latest.resetFrame.request(() => {
              if (innerRef.current) {
                formatCurrencyValue(innerRef.current.value)
              }
            })
          }
        }

        associatedForm?.addEventListener('reset', handleReset)

        return () => {
          associatedForm?.removeEventListener('reset', handleReset)
          latest.resetFrame.cancel()
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
}
