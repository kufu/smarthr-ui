import React, { ComponentProps, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { isTouchDevice } from '../../libs/ua'
import { UnstyledButton } from '../Button'

const tabItem = tv({
  slots: {
    wrapper: [
      'smarthr-ui-TabItem',
      'shr-relative shr-cursor-pointer shr-px-1 shr-py-0.75 shr-font-bold shr-text-grey shr-inline-flex shr-items-center shr-gap-0.5 shr-leading-none',
      'hover:shr-bg-white-darken hover:shr-text-black',
      'disabled:shr-cursor-not-allowed disabled:shr-bg-transparent disabled:shr-text-grey/50',
      'aria-selected:shr-text-black',
      'aria-selected:before:shr-absolute aria-selected:before:shr-inset-x-0 aria-selected:before:shr-bottom-0 aria-selected:before:shr-content-[""] aria-selected:before:shr-block aria-selected:before:shr-h-0.25 aria-selected:before:shr-bg-main aria-selected:before:shr-z-1',
    ],
    suffixWrapper: [
      // Badge など内包要素に依って高さが変わらないようにするため、ネガティブマージンを指定
      '-shr-my-0.25',
      // 内包アイコンの leading を詰める
      '[&_.smarthr-ui-Icon]:shr-block',
    ],
  },
  variants: {
    isTouchDevice: {
      false: {
        wrapper: 'shr-transition-colors',
      },
    },
  },
})

type Props = PropsWithChildren<{
  /** タブの ID */
  id: string
  /** ボタン内の末尾に表示する内容 */
  suffix?: React.ReactNode
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
  children,
  suffix,
  onClick,
  selected = false,
  className,
  disabled = false,
  ...props
}) => {
  const { wrapperStyle, suffixStyle } = useMemo(() => {
    const { wrapper, suffixWrapper } = tabItem({ isTouchDevice })
    return {
      wrapperStyle: wrapper({ className }),
      suffixStyle: suffixWrapper(),
    }
  }, [className])

  return (
    <UnstyledButton
      {...props}
      id={id}
      role="tab"
      aria-selected={selected}
      className={wrapperStyle}
      onClick={() => onClick(id)}
      disabled={disabled}
      type="button"
    >
      {children}
      {suffix && <span className={suffixStyle}>{suffix}</span>}
    </UnstyledButton>
  )
}
