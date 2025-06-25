'use client'

import { type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

type Props = {
  /** ローダーの大きさ */
  size?: 's' | 'm'
  /** 代替テキスト */
  alt?: ReactNode
  /** コンポーネントの色調 */
  type?: 'primary' | 'light'
}

const classNameGenerator = tv({
  slots: {
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
        line: ['shr-border-main', 'forced-colors:shr-border-[ButtonBorder]'],
      },
      light: {
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

export const LoaderSpinner = memo<Props>(({ size = 'm', alt, type = 'primary' }) => {
  const { localize } = useIntl()

  const classNames = useMemo(() => {
    const { spinner, line, cog, cogInner } = classNameGenerator({
      type,
      size,
    })

    return {
      spinner: spinner(),
      cog: cog(),
      cogInnerLeft: cogInner({ position: 'left' }),
      cogInnerRight: cogInner({ position: 'right' }),
      line1: line({ lineNum: 1 }),
      line2: line({ lineNum: 2 }),
      line3: line({ lineNum: 3 }),
      line4: line({ lineNum: 4 }),
    }
  }, [type, size])

  const actualAlt = useMemo(
    () => alt ?? localize({ id: 'smarthr-ui/Loader/alt', defaultText: '処理中' }),
    [alt, localize],
  )

  const lineBody = (
    <>
      <span className={classNames.cog}>
        <span className={classNames.cogInnerLeft} />
      </span>
      <span className={classNames.cog}>
        <span className={classNames.cogInnerRight} />
      </span>
    </>
  )

  return (
    <span className={classNames.spinner}>
      <span className={classNames.line1}>{lineBody}</span>
      <span className={classNames.line2}>{lineBody}</span>
      <span className={classNames.line3}>{lineBody}</span>
      <span className={classNames.line4}>{lineBody}</span>
      <VisuallyHiddenText>{actualAlt}</VisuallyHiddenText>
    </span>
  )
})
