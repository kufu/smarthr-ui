import { type PropsWithChildren, memo } from 'react'

// TODO: 翻訳の仕組みが変更されるため、コンポーネント自体を削除する
export const Translate = memo<PropsWithChildren>(({ children }) => (
  <span data-wovn-enable="true">{children}</span>
))
