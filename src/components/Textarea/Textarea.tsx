import React, {
  TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { defaultHtmlFontSize } from '../../themes/createFontSize'

import { useClassNames } from './useClassNames'

import type { DecoratorsType } from '../../types'

type Props = {
  /** 入力値にエラーがあるかどうか */
  error?: boolean
  /** コンポーネントの幅 */
  width?: number | string
  /** 自動でフォーカスされるかどうか */
  autoFocus?: boolean
  /** 自動で広がるかどうか */
  autoResize?: boolean
  /** 最大行数。超えるとスクロールする。初期値は無限 */
  maxRows?: number
  /** 行数の初期値。省略した場合は2 */
  rows?: number
  /** コンポーネント内の文言を変更するための関数を設定 */
  decorators?: DecoratorsType<'beforeMaxLengthCount' | 'afterMaxLengthCount'>
  /**
   * @deprecated placeholder属性は非推奨です。別途ヒント用要素の設置を検討してください。
   */
  placeholder?: string
}
type ElementProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof Props>

const getStringLength = (value: string | number | readonly string[]) => {
  const formattedValue =
    typeof value === 'number' || typeof value === 'string'
      ? `${value}`
      : Array.isArray(value)
        ? value.join(',')
        : ''

  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
  const surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
  return formattedValue.length - (formattedValue.match(surrogatePairs) || []).length
}

const TEXT_BEFORE_MAXlENGTH_COUNT = 'あと'
const TEXT_AFTER_MAXlENGTH_COUNT = '文字'

export const Textarea = forwardRef<HTMLTextAreaElement, Props & ElementProps>(
  (
    {
      autoFocus,
      maxLength,
      width,
      className = '',
      autoResize = false,
      maxRows = Infinity,
      rows = 2,
      onInput,
      decorators,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const currentValue = props.defaultValue || props.value
    const [interimRows, setInterimRows] = useState(rows)
    const [count, setCount] = useState(currentValue ? getStringLength(currentValue) : 0)
    const textAreaWidth = typeof width === 'number' ? `${width}px` : width
    const beforeMaxLengthCount = useMemo(
      () =>
        decorators?.beforeMaxLengthCount?.(TEXT_BEFORE_MAXlENGTH_COUNT) ||
        TEXT_BEFORE_MAXlENGTH_COUNT,
      [decorators],
    )
    const afterMaxLengthCount = useMemo(
      () =>
        decorators?.afterMaxLengthCount?.(TEXT_AFTER_MAXlENGTH_COUNT) || TEXT_AFTER_MAXlENGTH_COUNT,
      [decorators],
    )

    useImperativeHandle<HTMLTextAreaElement | null, HTMLTextAreaElement | null>(
      ref,
      () => textareaRef.current,
    )

    useEffect(() => {
      if (autoFocus && textareaRef && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, [autoFocus])

    const handleKeyup = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      setCount(getStringLength(event.currentTarget.value))
    }, [])
    const handleInput = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!autoResize) {
          return onInput && onInput(e)
        }

        const previousRows = e.target.rows
        // 消したことを検知できないので必ず初期化
        e.target.rows = rows

        const currentRows = Math.floor(
          e.target.scrollHeight / (defaultHtmlFontSize * theme.leading.NORMAL),
        )

        if (previousRows === currentRows) {
          e.target.rows = currentRows
        } else if (maxRows < currentRows) {
          // 最大まで達したとき高さが潰れないように代入
          e.target.rows = maxRows
        }

        setInterimRows(currentRows < maxRows ? currentRows : maxRows)
        onInput && onInput(e)
      },
      [autoResize, maxRows, onInput, rows, theme.leading.NORMAL],
    )

    const classNames = useClassNames()

    return (
      <>
        {/* eslint-disable-next-line smarthr/a11y-input-has-name-attribute */}
        <StyledTextarea
          {...props}
          {...(maxLength ? { onKeyUp: handleKeyup } : {})}
          textAreaWidth={textAreaWidth}
          ref={textareaRef}
          themes={theme}
          aria-invalid={props.error || undefined}
          className={`${className} ${classNames.textarea}`}
          rows={interimRows}
          onInput={handleInput}
        />
        {maxLength && (
          <Counter themes={theme} className={classNames.counter}>
            {beforeMaxLengthCount}
            <span className={maxLength && maxLength - count <= 0 ? 'error' : ''}>
              {maxLength - count}
            </span>
            {afterMaxLengthCount}
          </Counter>
        )}
      </>
    )
  },
)

const StyledTextarea = styled.textarea<Props & { themes: Theme; textAreaWidth?: string | number }>`
  ${({
    themes: { border, color, leading, fontSize, radius, shadow, spacingByChar },
    textAreaWidth = 'auto',
    error,
  }) => css`
    box-sizing: border-box;
    opacity: 1;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    padding: ${spacingByChar(0.5)};
    font-size: ${fontSize.M};
    line-height: ${leading.NORMAL};
    color: ${color.TEXT_BLACK};
    width: ${textAreaWidth};

    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    ${error &&
    css`
      border-color: ${color.DANGER};
    `}
    &::placeholder {
      color: ${color.TEXT_GREY};
    }
    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
    &:disabled {
      background-color: ${color.COLUMN};
      pointer-events: none;

      &,
      &::placeholder {
        color: ${color.TEXT_DISABLED};
      }
    }
  `}
`

const Counter = styled.span<{ themes: Theme }>`
  ${({ themes: { fontSize, color } }) => css`
    display: block;
    font-size: ${fontSize.S};

    > span {
      font-weight: bold;
      color: ${color.TEXT_GREY};
      &.error {
        color: ${color.DANGER};
      }
    }
  `}
`
