import React, { FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Base, BaseElementProps } from '../Base'
import { ResponseMessage } from '../ResponseMessage'

type Props = PropsWithChildren<{
  /** 表示する情報の種類 */
  type?: 'info' | 'success' | 'warning' | 'error'
}>

const compactInformationPanel = tv({
  base: ['smarthr-ui-CompactInformationPanel', 'shr-flex shr-p-1 shr-shadow-layer-3'],
})

/**
 * @deprecated `CompactInformationPanel` は非推奨です。`NotificationBar[base="base"]` を使用してください。
 */
export const CompactInformationPanel: FC<Props & BaseElementProps> = ({
  type = 'info',
  className,
  children,
  ...props
}) => {
  const styles = useMemo(() => compactInformationPanel({ className }), [className])

  return (
    <Base {...props} className={styles}>
      <ResponseMessage type={type} iconGap={0.5}>
        {children}
      </ResponseMessage>
    </Base>
  )
}
