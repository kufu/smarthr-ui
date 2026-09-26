import { type ComponentProps, type FC, type ReactNode, type Ref, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { Tooltip } from '../../Tooltip'
import { Input } from '../client'

type Props = Omit<ComponentProps<typeof Input>, 'ref'> & {
  /** 入力欄に紐付けるツールチップに表示するメッセージ */
  tooltipMessage: ReactNode
  outerRef?: Ref<HTMLInputElement>
}

const classNameGenerator = tv({
  base: 'smarthr-ui-InputWithTooltip [&]:shr-overflow-y-visible',
})

export const InputWithTooltip: FC<Props> = ({
  tooltipMessage,
  width,
  className,
  outerRef,
  ...rest
}) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
  }

  const actualClassName = useMemo(() => classNameGenerator({ className }), [className])

  return (
    // eslint-disable-next-line smarthr/a11y-scroller-has-tabindex
    <Tooltip tabIndex={-1} className={actualClassName} style={style} message={tooltipMessage}>
      {/* eslint-disable-next-line smarthr/a11y-input-in-form-control */}
      <Input {...rest} ref={outerRef} width={style.width} />
    </Tooltip>
  )
}
