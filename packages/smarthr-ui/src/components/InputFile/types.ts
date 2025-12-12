import type { classNameGenerator } from './style'
import type { DecoratorsType } from '../../hooks/useDecorators'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import type { VariantProps } from 'tailwind-variants'

export type DecoratorKeyTypes = 'destroy'

type AbstractProps = VariantProps<typeof classNameGenerator> & {
  /** フォームのラベル */
  label: ReactNode
  /** ファイルの選択に変更があったときに発火するコールバック関数 */
  onChange?: (files: File[]) => void
  /** ファイルリストを表示するかどうか */
  hasFileList?: boolean
  /** コンポーネント内のテキストを変更する関数 */
  decorators?: DecoratorsType<DecoratorKeyTypes>
  error?: boolean
  /** ファイル複数選択の際に、選択済みのファイルと結合するかどうか */
  multiplyAppendable?: boolean
}
export type Props = AbstractProps & Omit<ComponentPropsWithRef<'input'>, keyof AbstractProps>
