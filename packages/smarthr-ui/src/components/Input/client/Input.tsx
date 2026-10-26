'use client'

import { type FC, type MouseEvent, type ReactNode, type WheelEvent, useId, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useMergeRefs } from '../../../hooks/client/useMergeRefs'
import { useOnce } from '../../../hooks/client/useOnce'
import { useTheme } from '../../../hooks/client/useTheme'

import type { ExtendElementPropsWithRef } from '../../../types'

type Props = ExtendElementPropsWithRef<
  'input',
  {
    /** input 要素の `type` 値 */
    type?: HTMLInputElement['type']
    /** フォームにエラーがあるかどうか */
    error?: boolean
    /** コンポーネントの幅 */
    width?: number | string
    /** オートフォーカスを行うかどうか */
    autoFocus?: boolean
    /** コンポーネント内の先頭に表示する内容 */
    prefix?: ReactNode
    /** コンポーネント内の末尾に表示する内容 */
    suffix?: ReactNode
    /** コンポーネント内の、inputとsuffixの間に表示する操作用の要素（ボタン等） */
    subActionArea?: ReactNode
    /** 背景色。readOnly を下地の上に載せる場合に使う */
    bgColor?: keyof typeof backgroundColor
    /**
     * @deprecated placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
     */
    placeholder?: string
  },
  { omit: 'onWheel' | 'children' | 'aria-invalid' }
>

const backgroundColor = {
  BACKGROUND: 'background',
  COLUMN: 'column',
  BASE_GREY: 'base-grey',
  OVER_BACKGROUND: 'over-background',
  HEAD: 'head',
  BORDER: 'border',
  ACTION_BACKGROUND: 'action-background',
} as const

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-Input',
      'shr-border-shorthand shr-box-border shr-inline-flex shr-cursor-text shr-items-center shr-gap-0.5 shr-rounded-m shr-bg-white shr-px-0.5',
      'contrast-more:shr-border-high-contrast',
      'focus-within:shr-focus-indicator',
      'has-[[aria-invalid]]:shr-border-danger',
      'has-[:disabled]:[&&&]:shr-border-default/50',
      'has-[:disabled]:shr-pointer-events-none has-[:disabled]:shr-bg-white-darken',
      'has-[[readonly]:not(:disabled)]:[&&&]:shr-border-[theme(backgroundColor.column)] has-[[readonly]:not(:disabled)]:[&&&]:shr-bg-column',
    ],
    input: [
      'smarthr-ui-Input-input',
      'shr-inline-block shr-w-full shr-grow shr-border-none shr-bg-transparent shr-py-0.75 shr-text-base shr-leading-none shr-text-black shr-outline-none shr-outline-0',
      'placeholder:shr-text-grey',
      'disabled:shr-text-disabled disabled:shr-opacity-100',
      'shr-h-[theme(fontSize.base)]',
      // HINT: 日付系inputがsafariなどで対応されていないため、input要素内が空白になりフォームが潰れる場合がある
      // マジックナンバーになるが、ほかに適切なプロパティがないため、min-widthで最低幅を指定することで防ぐ
      '[&[type="datetime-local"]]:shr-min-w-[11em] [&[type="month"]]:shr-min-w-[8em] [&[type="time"]]:shr-min-w-[5em]',
    ],
    affix: [
      'shr-flex shr-shrink-0 shr-items-center shr-text-grey',
      '[.smarthr-ui-Input:has(:disabled)_&]:shr-text-disabled [.smarthr-ui-Input:has(:disabled)_&]:shr-opacity-100',
    ],
  },
})

// HINT: PC版ブラウザで年が6桁入力できる場合、コピー&ペーストが正常に動作しないなど、UI上の問題が発生する場合がある
// 回避のためmaxで年四桁を指定する
const DEFAULT_MAX_ATTR = {
  date: '9999-12-31',
  'datetime-local': '9999-12-31T23:59',
  month: '9999-12',
}

export const Input: FC<Props> = ({
  autoFocus,
  prefix,
  suffix,
  subActionArea,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
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
      subActionArea: affix({ className: 'smarthr-ui-Input-subActionArea' }),
    }
  }, [className])

  // HINT: WAI-ARIA9(https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA9)に倣い、
  // prefix/suffixがある場合はlabel・prefix・input・suffixをaria-labelledbyで結合し、
  // 単位などのテキストも含めて読み上げられるようにする。aria-labelledbyはaria-labelより
  // 優先されるため、利用者がaria-labelを指定している場合は自動生成を行わず、
  // 既存のアクセシブルネームを壊さないようにする
  const commonId = useId()
  const hasPrefix = !!prefix
  const hasSuffix = !!suffix
  const idAttrs = useMemo(() => {
    const prefixId = hasPrefix ? `${commonId}-prefix` : undefined
    const suffixId = hasSuffix ? `${commonId}-suffix` : undefined
    const hasAffixId = prefixId || suffixId
    const inputId = hasAffixId ? (id ?? `${commonId}-input`) : id

    const labelledbyItems = ariaLabelledBy ? [ariaLabelledBy] : []

    if (!ariaLabel) {
      if (prefixId) {
        labelledbyItems.push(prefixId)
      }
      if (hasAffixId && inputId) {
        labelledbyItems.push(inputId)
      }
      if (suffixId) {
        labelledbyItems.push(suffixId)
      }
    }

    return {
      inputId,
      prefixId,
      suffixId,
      ariaLabelledBy: labelledbyItems.length === 0 ? undefined : labelledbyItems.join(' '),
    }
  }, [hasPrefix, hasSuffix, ariaLabel, ariaLabelledBy, id, commonId])

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
      {prefix && (
        // HINT: aria-labelledbyでinputのアクセシブルネームに合流させるため、
        // 独立した要素としてスクリーンリーダーに読み上げられないようaria-hiddenにする
        <span id={idAttrs.prefixId} className={classNames.prefix} aria-hidden>
          {prefix}
        </span>
      )}
      <input
        {...rest}
        ref={mergedRef}
        type={type}
        id={idAttrs.inputId}
        max={max || (type && DEFAULT_MAX_ATTR[type as keyof typeof DEFAULT_MAX_ATTR]) || undefined}
        className={classNames.input}
        aria-invalid={errorAttr}
        aria-label={ariaLabel}
        aria-labelledby={idAttrs.ariaLabelledBy || undefined}
        data-smarthr-ui-input-error={errorAttr}
        data-smarthr-ui-input="true"
        onWheel={type === 'number' ? disableWheel : undefined}
      />
      {subActionArea && <span className={classNames.subActionArea}>{subActionArea}</span>}
      {suffix && (
        // HINT: aria-labelledbyでinputのアクセシブルネームに合流させるため、
        // 独立した要素としてスクリーンリーダーに読み上げられないようaria-hiddenにする
        <span id={idAttrs.suffixId} className={classNames.suffix} aria-hidden>
          {suffix}
        </span>
      )}
    </span>
  )
}

const disableWheel = (e: WheelEvent) => {
  // wheel イベントに preventDefault はないため
  if (e.target) {
    ;(e.target as HTMLInputElement).blur()
  }
}
