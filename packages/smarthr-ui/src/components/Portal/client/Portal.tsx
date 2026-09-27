'use client'

import { type ComponentPropsWithoutRef, type ElementType, type FC, useState } from 'react'
import { createPortal } from 'react-dom'

import { useEnhancedEffect } from '../../../hooks/client/useEnhancedEffect'

type PortalProps = ComponentPropsWithoutRef<'div'> & {
  as?: ElementType
}

export const Portal: FC<PortalProps> = ({ as: Component = 'div', children, ...rest }) => {
  const [mounted, setMounted] = useState(false)

  useEnhancedEffect(() => {
    // Next.jsのhydration error回避のため、マウント後にのみportalを描画する
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return createPortal(<Component {...rest}>{children}</Component>, document.body)
}
