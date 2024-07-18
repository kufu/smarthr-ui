import React, { ComponentProps, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { isTouchDevice } from '../../libs/ua'
import { UnstyledButton } from '../Button'
import { FaCircleInfoIcon } from '../Icon'
import { Cluster } from '../Layout'
import { Tooltip } from '../Tooltip'

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
const disabledTooltip = tv({
  base: ['[&_.smarthr-ui-Icon]:shr-text-grey'],
})

type Props = PropsWithChildren<{
  /** タブの ID */
  id: string
  /** `true` のとき、タブが選択状態のスタイルになる */
  selected?: boolean
  /** `true` のとき、タブを無効状態にしてクリック不能にする */
  disabled?: boolean
  /** disabledが `true` のときにTooltipに表示する無効な理由 **/
  disabledDetail?: {
    icon?: React.FunctionComponent
    message: React.ReactNode
  }
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
  disabledDetail,
  ...props
}) => {
  const tabItemStyle = useMemo(() => tabItem({ className, isTouchDevice }), [className])

  if (disabled && disabledDetail) {
    const DisabledDetailIcon = disabledDetail.icon || FaCircleInfoIcon

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
      >
        <Cluster inline align="center" gap={0.25}>
          {props.children}
          <Tooltip
            message={disabledDetail?.message}
            triggerType="icon"
            horizontal="auto"
            vertical="auto"
            className={disabledTooltip()}
          >
            <DisabledDetailIcon />
          </Tooltip>
        </Cluster>
      </UnstyledButton>
    )
  }

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
