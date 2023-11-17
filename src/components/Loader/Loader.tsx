import React, { FC, HTMLAttributes, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { VisuallyHiddenText } from '../VisuallyHiddenText'

type Props = {
  /** ローダーの大きさ */
  size?: 's' | 'm'
  /** 代替テキスト */
  alt?: ReactNode
  /** 表示するメッセージ */
  text?: ReactNode
  /** コンポーネントの色調 */
  type?: 'primary' | 'light'
  as?: string | React.ComponentType<any>
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const loaderStyle = tv({
  slots: {
    wrapper: ['smarthr-ui-Loader', 'shr-inline-block', 'shr-overflow-hidden'],
    spinner: ['shr-relative', 'shr-block', 'shr-animate-loader-spinner-spin', 'shr-mx-auto'],
    line: ['shr-absolute', 'shr-block', 'shr-w-full', 'shr-h-full', 'shr-opacity-0'],
    cog: [
      'shr-inline-block',
      'shr-relative',
      'shr-w-1/2',
      'shr-h-full',
      'shr-overflow-hidden',
      'shr-border-inherit',
    ],
    cogInner: [
      'shr-absolute',
      'shr-top-0',
      'shr-left-0',
      'shr-block',
      'shr-w-[200%]',
      'shr-h-full',
      'shr-box-border',
      'shr-border-solid',
      'shr-border-inherit',
      'shr-border-b-transparent',
      'shr-rounded-[50%]',
    ],
    textSlot: ['shr-block', 'shr-mt-1', 'shr-text-base', 'shr-text-center'],
  },
  variants: {
    size: {
      s: {
        spinner: ['shr-w-1.5', 'shr-h-1.5'],
        cogInner: ['shr-border-2'],
      },
      m: {
        spinner: ['shr-w-3', 'shr-h-3'],
        cogInner: ['shr-border-4'],
      },
    },
    type: {
      primary: {
        textSlot: ['shr-text-black'],
        line: ['shr-border-brand', 'contrast-more:shr-border-main'],
      },
      light: {
        textSlot: ['shr-text-white'],
        line: ['shr-border-white'],
      },
    },
    lineNum: {
      1: {
        line: ['shr-animate-loader-line1-rotate'],
      },
      2: {
        line: ['shr-animate-loader-line2-rotate'],
      },
      3: {
        line: ['shr-animate-loader-line3-rotate'],
      },
      4: {
        line: ['shr-animate-loader-line4-rotate'],
      },
    },
    position: {
      left: {
        cogInner: [
          'shr-border-r-transparent',
          'shr-rotate-[129deg]',
          'shr-animate-loader-left-spin',
        ],
      },
      right: {
        cogInner: [
          'shr-border-l-transparent',
          'shr-rotate-[-129deg]',
          'shr-animate-loader-right-spin',
          '-shr-left-full',
        ],
      },
    },
  },
})
export const Loader: FC<Props & ElementProps> = ({
  size = 'm',
  alt = '処理中',
  text,
  type = 'primary',
  className = '',
  ...props
}) => {
  const { wrapper, spinner, line, cog, cogInner, textSlot } = loaderStyle({
    type,
    size,
    className,
  })
  const wrapperStyle = useMemo(() => wrapper({ className }), [wrapper, className])
  const spinnerStyle = useMemo(() => spinner(), [spinner])
  const cogStyle = useMemo(() => cog(), [cog])
  const textStyle = useMemo(() => textSlot(), [textSlot])

  return (
    <div {...props} className={wrapperStyle} role="status">
      <span className={spinnerStyle}>
        {[...Array(4)].map((_, index) => (
          <span className={line({ lineNum: (index + 1) as 1 | 2 | 3 | 4 })} key={index}>
            <span className={cogStyle}>
              <span className={cogInner({ position: 'left' })} />
            </span>
            <span className={cogStyle}>
              <span className={cogInner({ position: 'right' })} />
            </span>
          </span>
        ))}
        <VisuallyHiddenText>{alt}</VisuallyHiddenText>
      </span>
      {text && <span className={textStyle}>{text}</span>}
    </div>
  )
}
