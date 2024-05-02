import React, { ComponentProps, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { isTouchDevice } from '../../libs/ua'
import { UnstyledButton } from '../Button'

const tabItem = tv({
  base: [
    'smarthr-ui-TabItem',
    'shr-cursor-pointer shr-appearance-none shr-border-none shr-bg-transparent shr-px-1 shr-py-0 shr-font-bold hover:shr-bg-column hover:shr-text-black [&]:shr-box-border [&]:shr-text-grey',
    'shr-h-[43px]', // TODO 高さを指定しないようにする
    'disabled:shr-cursor-not-allowed disabled:shr-bg-transparent disabled:shr-text-grey/50',
    'aria-selected:shr-border-b-shorthand aria-selected:shr-relative aria-selected:shr-border-b-[3px] aria-selected:shr-border-main aria-selected:shr-text-black',
    'aria-selected:shr-h-[40px]', // TODO 高さを指定しないようにする
  ],
  variants: {
    isTouchDevice: {
      false: 'shr-transition-colors',
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
  ComponentProps<typeof UnstyledButton>,
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
  const tabItemStyle = useMemo(() => tabItem({ className, isTouchDevice }), [className])

  return (
    <UnstyledButton
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
