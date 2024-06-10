import React, {
  ComponentPropsWithRef,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { VariantProps, tv } from 'tailwind-variants'

import { Tooltip } from '../Tooltip'

type Props = PropsWithChildren<VariantProps<typeof lineClamp>>
type ElementProps = Omit<ComponentPropsWithRef<'span'>, keyof Props>

const root = tv({
  base: 'smarthr-ui-LineClamp shr-relative',
})

const lineClamp = tv({
  variants: {
    maxLines: {
      1: 'shr-inline-block shr-w-full shr-overflow-hidden shr-overflow-ellipsis shr-whitespace-nowrap shr-align-middle',
      2: 'shr-line-clamp-[2]',
      3: 'shr-line-clamp-[3]',
      4: 'shr-line-clamp-[4]',
      5: 'shr-line-clamp-[5]',
      6: 'shr-line-clamp-[6]',
    },
  },
})

export const LineClamp: FC<Props & ElementProps> = ({
  maxLines = 3,
  children,
  className,
  ...props
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const shadowRef = useRef<HTMLSpanElement>(null)

  const isMultiLineOverflow = () => {
    const el = ref.current
    const shadowEl = shadowRef.current
    return el && shadowEl
      ? el.scrollWidth > el.clientWidth || shadowEl.clientHeight > el.clientHeight
      : false
  }

  useEffect(() => {
    setTooltipVisible(isMultiLineOverflow())
  }, [maxLines, children])

  if (maxLines < 1) {
    throw new Error('"maxLines" cannot be less than 0.')
  }

  const lineClampStyles = useMemo(() => lineClamp({ maxLines }), [maxLines])
  const rootStyles = useMemo(() => root({ className }), [className])

  const ActualLineClamp = () => (
    <span className={rootStyles}>
      <span {...props} className={lineClampStyles} ref={ref}>
        {children}
      </span>
      {/* 切り取られていないテキストの高さを取得するための要素 */}
      <span
        aria-hidden
        className="shr-invisible shr-absolute shr-w-full shr-opacity-0"
        ref={shadowRef}
      >
        {children}
      </span>
    </span>
  )

  return isTooltipVisible ? (
    <Tooltip message={children} multiLine vertical="auto">
      <ActualLineClamp />
    </Tooltip>
  ) : (
    <ActualLineClamp />
  )
}
