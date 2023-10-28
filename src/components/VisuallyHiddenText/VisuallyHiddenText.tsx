import React, { ComponentProps } from 'react'

type Props = ComponentProps<'span'> & {
  /** テキストコンポーネントの HTML タグ名。初期値は span */
  as?: string | React.ComponentType<any>
}

export const VisuallyHiddenText: React.FC<Props> = ({ as: Component = 'span', ...others }) => (
  <Component
    {...others}
    style={{
      clipPath: 'inset(100%)',
      clip: 'rect(0 0 0 0)',
    }}
    className="shr-absolute shr-left-0 shr-top-[-1px] shr-h-[1px] shr-w-[1px] shr-overflow-hidden shr-whitespace-nowrap shr-border-0 shr-p-0"
  />
)
