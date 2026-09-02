import { type ComponentProps, type ReactNode, memo } from 'react'
import { tv } from 'tailwind-variants'

import { Localizer } from '../../intl'

import { LoaderSpinner } from './LoaderSpinner'
import { LoaderWrapper } from './client'

type BaseProps = {
  /** ローダーの大きさ */
  size?: 'S' | 'M'
  /** 代替テキスト */
  alt?: ReactNode
  /** 表示するメッセージ */
  text?: ReactNode
  /** コンポーネントの色調 */
  type?: 'primary' | 'light'
}
type Props = BaseProps & Omit<ComponentProps<'span'>, keyof BaseProps>

const classNameGenerator = tv({
  slots: {
    wrapper: ['smarthr-ui-Loader', 'shr-inline-block', 'shr-overflow-hidden'],
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
      const { wrapper, textSlot } = classNameGenerator()

      return {
        wrapper: wrapper({ className }),
        text: textSlot({
          type,
        }),
      }
    })()

    return (
      <LoaderWrapper {...rest} className={classNames.wrapper}>
        <LoaderSpinner
          type={type}
          alt={alt || <Localizer id="smarthr-ui/Loader/alt" defaultText="処理中" />}
          size={size}
        />
        {text && <span className={classNames.text}>{text}</span>}
      </LoaderWrapper>
    )
  },
)
