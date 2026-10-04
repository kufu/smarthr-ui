'use client'

import { type ComponentPropsWithoutRef, type FC, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type BaseProps = {
  parent?: HTMLElement
}
type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

export const DialogPortal: FC<Props> = ({ parent, children, ...rest }) => {
  const [isMounted, setIsMounted] = useState(false)

  // HINT: document.bodyへのアクセスはこのeffect内、およびisMounted=true確定後の
  // createPortal呼び出し内に限定する。Server Component(初回SSR含む)ではこの
  // コンポーネント自体はサーバーで評価されるため、レンダー本体で無条件にdocumentへ
  // アクセスするとReferenceErrorになる。
  //
  // parentが指定されている場合、その要素がまだDOMに未接続だと子孫のref attach時点で
  // getBoundingClientRectやfocusが効かない(ModelessDialogの中央寄せずれの原因)。
  // parentは開いている最中に変わりうるため、共有Portalのマウント判定(mounted後は
  // 不要になるため専用コンポーネントに切り出す)とは異なり、常時有効なeffectとして
  // 変化のたびに接続状態を再評価する必要があり、切り出す理由がない
  useLayoutEffect(() => {
    setIsMounted((parent || document.body).isConnected)
  }, [parent])

  if (!isMounted) {
    return null
  }

  return createPortal(<div {...rest}>{children}</div>, parent || document.body)
}
