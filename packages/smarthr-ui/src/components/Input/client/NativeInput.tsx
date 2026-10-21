'use client'

import { type FC, type MouseEvent, type WheelEvent, useMemo } from 'react'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useOnce } from '../../../hooks/client/useOnce'
import { useTheme } from '../../../hooks/client/useTheme'

import { backgroundColor, classNameGenerator } from './inputStyle'

import type { Props } from './type'

// HINT: PC版ブラウザで年が6桁入力できる場合、コピー&ペーストが正常に動作しないなど、UI上の問題が発生する場合がある
// 回避のためmaxで年四桁を指定する
const DEFAULT_MAX_ATTR = {
  date: '9999-12-31',
  'datetime-local': '9999-12-31T23:59',
  month: '9999-12',
}

export const NativeInput: FC<Props> = ({
  autoFocus,
  prefix,
  suffix,
  className,
  width,
  error,
  bgColor,
  type,
  max,
  ref,
  ...rest
}) => {
  const theme = useTheme()

  const callbackRef = useOnce((node: HTMLInputElement | null) => {
    if (node && autoFocus) {
      node.focus()
    }
  })

  const mergedRef = useMergeRefs(callbackRef, ref)

  const classNames = useMemo(() => {
    const { wrapper, input, affix } = classNameGenerator()

    return {
      wrapper: wrapper({ className }),
      input: input(),
      prefix: affix({ className: 'smarthr-ui-Input-prefix' }),
      suffix: affix({ className: 'smarthr-ui-Input-suffix' }),
    }
  }, [className])

  const styleColor = bgColor ? theme.backgroundColor[backgroundColor[bgColor]] : undefined
  const styleMaxWidth = typeof width === 'number' ? `${width}px` : width
  const errorAttr = error || undefined

  return (
    <span
      role="presentation"
      className={classNames.wrapper}
      style={{
        borderColor: styleColor,
        backgroundColor: styleColor,
        maxWidth: styleMaxWidth,
        width: styleMaxWidth ? '100%' : undefined,
      }}
      onClick={(delegateEvent: MouseEvent<HTMLSpanElement>) => {
        delegateEvent.currentTarget
          .querySelector<HTMLInputElement>('[data-smarthr-ui-input="true"]')
          ?.focus()
      }}
    >
      {prefix && <span className={classNames.prefix}>{prefix}</span>}
      <input
        {...rest}
        ref={mergedRef}
        type={type}
        max={max || (type && DEFAULT_MAX_ATTR[type as keyof typeof DEFAULT_MAX_ATTR]) || undefined}
        className={classNames.input}
        aria-invalid={errorAttr}
        data-smarthr-ui-input-error={errorAttr}
        data-smarthr-ui-input="true"
        onWheel={type === 'number' ? disableWheel : undefined}
      />
      {suffix && <span className={classNames.suffix}>{suffix}</span>}
    </span>
  )
}

const disableWheel = (e: WheelEvent) => {
  // wheel イベントに preventDefault はないため
  if (e.target) {
    ;(e.target as HTMLInputElement).blur()
  }
}
