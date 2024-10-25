import React, { ComponentProps, FC, PropsWithChildren, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { isTouchDevice } from '../../libs/ua'
import { UnstyledButton } from '../Button'
import { FaCircleInfoIcon } from '../Icon'
import { Tooltip } from '../Tooltip'

const tabItem = tv({
  slots: {
    wrapper: [
      'smarthr-ui-TabItem',
      'shr-group/tabitem',
      'shr-relative shr-px-1 shr-py-0.75 shr-inline-flex shr-items-center shr-gap-0.5',
      'hover:shr-bg-white-darken',
      'focus-visible:shr-z-1 focus-visible:shr-focus-indicator--inner',
      'disabled:shr-cursor-not-allowed disabled:shr-bg-transparent',
      'aria-selected:before:shr-absolute aria-selected:before:shr-inset-x-0 aria-selected:before:shr-bottom-0 aria-selected:before:shr-content-[""] aria-selected:before:shr-block aria-selected:before:shr-h-0.25 aria-selected:before:shr-bg-main aria-selected:before:shr-z-1',
      'forced-colors:aria-selected:before:shr-bg-[Highlight]',
    ],
    label: [
      'shr-font-bold shr-text-grey shr-leading-none',
      'group-hover/tabitem:shr-text-black',
      'group-disabled/tabitem:shr-text-grey/50',
      'group-aria-selected/tabitem:shr-text-black',
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
  /**
   * 無効な理由
   */
  disabledDetail?: {
    icon?: React.ReactNode
    message: React.ReactNode
  }
  /** タブをクリックした時に発火するコールバック関数 */
  onClick: (tabId: string) => void
}>
type ElementProps = Omit<
  ComponentProps<typeof UnstyledButton>,
  keyof Props | 'aria-selected' | 'type'
>

export const TabItem: FC<Props & ElementProps> = ({
  selected = false,
  disabledDetail,
  ...rest
}) => {
  const tabAttrs = {
    role: 'tab',
    'aria-selected': selected,
  }

  if (rest.disabled && disabledDetail) {
    const Icon = disabledDetail.icon || <FaCircleInfoIcon color="TEXT_GREY" />
    return (
      <Tooltip
        {...tabAttrs}
        message={disabledDetail.message}
        horizontal="center"
        vertical="auto"
        ariaDescribedbyTarget="inner"
        aria-disabled={rest.disabled}
        className="focus-visible:shr-focus-indicator--inner"
      >
        <TabButton {...rest} suffix={Icon} />
      </Tooltip>
    )
  }

  return <TabButton {...rest} {...tabAttrs} />
}

const TabButton: FC<Props & ElementProps> = ({
  id,
  children,
  suffix,
  onClick,
  className,
  ...rest
}) => {
  const { wrapperStyle, labelStyle, suffixStyle } = useMemo(() => {
    const { wrapper, label, suffixWrapper } = tabItem({ isTouchDevice })
    return {
      wrapperStyle: wrapper({ className }),
      labelStyle: label(),
      suffixStyle: suffixWrapper(),
    }
  }, [className])

  return (
    <UnstyledButton
      {...rest}
      type="button"
      id={id}
      className={wrapperStyle}
      onClick={() => onClick(id)}
    >
      <span className={labelStyle}>{children}</span>
      {suffix && <span className={suffixStyle}>{suffix}</span>}
    </UnstyledButton>
  )
}
