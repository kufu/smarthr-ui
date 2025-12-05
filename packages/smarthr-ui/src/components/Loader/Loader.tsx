import { type ComponentProps, type ReactNode, memo, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { LoaderSpinner } from './LoaderSpinner'

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

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-Loader', 'shr-overflow-hidden shr-inline-block'],
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

export const Loader = memo<Props & ElementProps>(
  ({ size = 'm', alt, text, type = 'primary', role = 'status', className, ...props }) => {
    const classNames = useMemo(() => {
      const { wrapper, textSlot } = classNameGenerator({
        type,
      })

      return {
        wrapper: wrapper({ className }),
        text: textSlot(),
      }
    }, [type, className])

    return (
      <span {...props} role={role} className={classNames.wrapper}>
        <LoaderSpinner type={type} size={size} alt={alt} />
        {text && <span className={classNames.text}>{text}</span>}
      </span>
    )
  },
)
