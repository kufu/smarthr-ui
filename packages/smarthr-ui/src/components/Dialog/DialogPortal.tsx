'use client'

import { type ComponentPropsWithoutRef, type FC, type PropsWithChildren, useState } from 'react'
import { createPortal } from 'react-dom'

import { useEnhancedEffect } from '../../hooks/client/useEnhancedEffect'

type Props = PropsWithChildren<ComponentPropsWithoutRef<'div'>> & {
  parent?: HTMLElement
}

export const DialogPortal: FC<Props> = ({ parent, children, ...rest }) => {
  const [isMounted, setIsMounted] = useState(false)
  const actualParent = parent || document.body

  return (
    <>
      <MountChecker actualParent={actualParent} setIsMounted={setIsMounted} />
      {isMounted && createPortal(<div {...rest}>{children}</div>, actualParent)}
    </>
  )
}

const MountChecker: FC<{
  actualParent: HTMLElement
  setIsMounted: (mounted: boolean) => void
}> = ({ actualParent, setIsMounted }) => {
  // HINT: parentが指定されている場合、その要素がまだDOMに未接続だと子孫のref attach時点で
  // getBoundingClientRectやfocusが効かない(ModelessDialogの中央寄せずれの原因)。
  // parentは開いている最中に変わりうるため、共有Portalのマウント判定(mounted後は
  // アンマウントする)とは異なり、このコンポーネント自体は常時レンダーし続け、
  // 変化のたびに接続状態を再評価する
  useEnhancedEffect(() => {
    setIsMounted(actualParent.isConnected)
  }, [actualParent, setIsMounted])

  return null
}
