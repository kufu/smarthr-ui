import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { isTouchDevice } from '../../libs/ua'

const tabItem = tv({
  base: [
    'smarthr-ui-TabItem',
    'shr-bg-transparent',
    'shr-cursor-pointer',
    'shr-appearance-none',
    'shr-font-bold',
    'shr-py-0',
    'shr-px-1',
    'shr-box-border',
    'hover:shr-bg-column',
    'hover:shr-text-black',
    'disabled:shr-bg-transparent',
    'disabled:shr-text-grey/50',
    'disabled:shr-cursor-not-allowed',
  ],
  variants: {
    selected: {
      true: [
        'shr-relative',
        'shr-text-black',
        'shr-border-b-[3px]',
        'shr-border-t-0',
        'shr-border-l-0',
        'shr-border-r-0',
        'shr-border-solid',
        'shr-border-main',
        'shr-h-[40px]', // TODO 高さを指定しないようにする
      ],
      false: ['shr-text-grey', 'shr-border-none', 'shr-h-[43px]'], // TODO 高さを指定しないようにする
    },
    isTouchDevice: {
      false: ['shr-transition-colors'],
    },
  },
})

type Props = PropsWithChildren<{
  /** タブの ID */
  id: string
  /** `true` のとき、タブが選択状態のスタイルになる */
  selected?: boolean
  /** `true` のとき、タブを無効状態にしてクリック不能にする */
  disabled?: boolean
  /** タブをクリックした時に発火するコールバック関数 */
  onClick: (tabId: string) => void
}>
type ElementProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  keyof Props | 'role' | 'aria-selected' | 'type'
>

export const TabItem: FC<Props & ElementProps> = ({
  id,
  onClick,
  selected = false,
  className,
  disabled = false,
  ...props
}) => {
  const tabItemStyle = useMemo(
    () => tabItem({ className, selected, isTouchDevice }),
    [className, selected],
  )

  return (
    <button
      {...props}
      id={id}
      role="tab"
      aria-selected={selected}
      className={tabItemStyle}
      onClick={() => onClick(id)}
      disabled={disabled}
      type="button"
    />
  )
}
