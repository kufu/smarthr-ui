import { type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { LiveRegion } from '../LiveRegion'

import { LoaderSpinner } from './LoaderSpinner'

import type { SHRComponentPropsWithoutRef } from '../../types'

type Props = SHRComponentPropsWithoutRef<
  'span',
  {
    /** ローダーの大きさ */
    size?: 'S' | 'M'
    /** 代替テキスト */
    alt?: ReactNode
    /** 表示するメッセージ */
    text?: ReactNode
    /** コンポーネントの色調 */
    type?: 'primary' | 'light'
  }
>

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-Loader', 'shr-inline-block shr-overflow-hidden'],
    textSlot: ['shr-block', 'shr-mt-1', 'shr-text-base', 'shr-text-center'],
  },
  variants: {
    type: {
      primary: {
        textSlot: ['shr-text-black'],
      },
      light: {
        textSlot: ['shr-text-white'],
      },
    },
  },
})

export const Loader = memo<Props>(
  ({ size = 'M', alt, text, type = 'primary', className, ...rest }) => {
    // HINT: Loaderは一度表示されれば属性が変わる可能性はほぼ無いためuseMemoしない
    const classNames = (() => {
      const { wrapper, textSlot } = classNameGenerator({
        type,
      })

      return {
        wrapper: wrapper({ className }),
        text: textSlot(),
      }
    })()

    return (
      <LiveRegion {...rest} className={classNames.wrapper}>
        <LoaderSpinner type={type} alt={alt} size={size} />
        {text && <span className={classNames.text}>{text}</span>}
      </LiveRegion>
    )
  },
)
