import { memo } from 'react'

import { type DecoratorsType, useDecorators } from '../../hooks/useDecorators'

type Props = {
  decorators?: DecoratorsType<DecoratorKeyTypes>
}

const DECORATOR_DEFAULT_TEXTS = {
  text: '〜',
} as const
type DecoratorKeyTypes = keyof typeof DECORATOR_DEFAULT_TEXTS

/**
 * @deprecated このコンポーネントはスクリーンリーダー「NVDA」のバグを迂回するために導入されましたが、当該のバグは解消されているため、今後削除される予定です。代わりにプレーンな文字列 `〜` を使ってください。（[参考: nvdajp/nvdajp#440](https://github.com/nvdajp/nvdajp/issues/440)）
 */
export const RangeSeparator = memo<Props>(({ decorators }) => {
  const decorated = useDecorators<DecoratorKeyTypes>(DECORATOR_DEFAULT_TEXTS, decorators)
  return decorated.text
})
