import React, { ComponentProps, FC, ReactNode, useMemo } from 'react'
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
}
type ElementProps = Omit<ComponentProps<'span'>, keyof Props>

const loaderStyle = tv({
  slots: {
    wrapper: ['smarthr-ui-Loader', 'shr-inline-block shr-overflow-hidden'],
    spinner: [
      'smarthr-ui-Loader-spinner', // Button コンポーネントで使用
      'shr-relative',
      'shr-block',
      'shr-mx-auto',
      'shr-animate-[spin_1.6s_linear_infinite]',
    ],
    line: [
      'smarthr-ui-Loader-line', // Button コンポーネントで使用
      'shr-absolute',
      'shr-block',
      'shr-w-full',
      'shr-h-full',
      'shr-opacity-0',
    ],
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
      'shr-block',
      'shr-w-[200%]',
      'shr-h-full',
      'shr-box-border',
      'shr-border-solid',
      'shr-border-inherit',
      'shr-border-b-transparent',
      'shr-rounded-[50%]',
      'shr-forced-color-adjust-none',
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
        line: ['shr-border-main', 'forced-colors:shr-border-[ButtonBorder]'],
      },
      light: {
        textSlot: ['shr-text-white'],
        line: ['shr-border-white', 'forced-colors:shr-border-[ButtonBorder]'],
      },
    },
    lineNum: {
      1: {
        line: [
          'shr-animate-[loader-line-full-unfill-rotate_4.8s_ease-in-out_infinite_both,_loader-line1-fade-in-out_4.8s_ease-in-out_infinite_both]',
        ],
      },
      2: {
        line: [
          'shr-animate-[loader-line-full-unfill-rotate_4.8s_ease-in-out_infinite_both,_loader-line2-fade-in-out_4.8s_ease-in-out_infinite_both]',
        ],
      },
      3: {
        line: [
          'shr-animate-[loader-line-full-unfill-rotate_4.8s_ease-in-out_infinite_both,_loader-line3-fade-in-out_4.8s_ease-in-out_infinite_both]',
        ],
      },
      4: {
        line: [
          'shr-animate-[loader-line-full-unfill-rotate_4.8s_ease-in-out_infinite_both,_loader-line4-fade-in-out_4.8s_ease-in-out_infinite_both]',
        ],
      },
    },
    position: {
      left: {
        cogInner: [
          'shr-border-r-transparent',
          'shr-rotate-[129deg]',
          'shr-animate-[loader-left-spin_1.2s_ease-in-out_infinite_both]',
          'shr-left-0',
        ],
      },
      right: {
        cogInner: [
          'shr-border-l-transparent',
          'shr-rotate-[-129deg]',
          'shr-animate-[loader-right-spin_1.2s_ease-in-out_infinite_both]',
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
  role = 'status',
  className,
  ...props
}) => {
  const { wrapper, spinner, line, cog, cogInner, textSlot } = loaderStyle({
    type,
    size,
  })
  const wrapperStyle = useMemo(() => wrapper({ className }), [wrapper, className])
  const spinnerStyle = useMemo(() => spinner(), [spinner])
  const cogStyle = useMemo(() => cog(), [cog])
  const textStyle = useMemo(() => textSlot(), [textSlot])

  return (
    <span {...props} className={wrapperStyle} role={role}>
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
    </span>
  )
}
