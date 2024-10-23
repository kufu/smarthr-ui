import React from 'react'

type Props = {
  narrowWidth?: boolean
  narrowHeight?: boolean
}

export const ColorBox = ({ narrowWidth, narrowHeight }: Props) => (
  <div
    className={`${narrowWidth ? 'shr-min-w-[40px]' : 'shr-min-w-[80px]'} ${narrowHeight ? 'shr-min-h-[40px]' : 'shr-min-h-[80px]'} shr-text-white shr-bg-brand shr-rounded-l`}
  />
)
