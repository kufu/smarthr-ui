import type { FC, ReactNode } from 'react'

type Props = {
  shouldWrapContent: boolean
  wrapper: (children: ReactNode) => JSX.Element
  children: ReactNode
}

/**
 * 条件付きでラッパをレンダリングする
 */
export const ConditionalWrapper: FC<Props> = ({ shouldWrapContent, wrapper, children }) =>
  shouldWrapContent ? wrapper(children) : children
