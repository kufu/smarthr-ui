import { type ComponentProps, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { LoaderSpinner } from './LoaderSpinner'

type AbstractProps = {
  /** ローダーの大きさ */
  size?: 'S' | 'M'
  /** 代替テキスト */
  alt?: ReactNode
  /** 表示するメッセージ */
  text?: ReactNode
  /** コンポーネントの色調 */
  type?: 'primary' | 'light'
}
type Props = AbstractProps & Omit<ComponentProps<'span'>, keyof AbstractProps>

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
  ({ size = 'M', alt, text, type = 'primary', role = 'status', className, ...rest }) => {
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
      <span {...rest} role={role} className={classNames.wrapper}>
        <LoaderSpinner type={type} size={size} alt={alt} />
        {text && <span className={classNames.text}>{text}</span>}
      </span>
    )
  },
)
