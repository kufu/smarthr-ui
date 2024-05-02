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

const lineClamp = tv({
  base: 'smarthr-ui-LineClamp',
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
  if (maxLines < 1) {
    throw new Error('"maxLines" cannot be less than 0.')
  }

  const [isTooltipVisible, setTooltipVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const isMultiLineOverflow = () => {
    const el = ref.current
    return el ? el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight : false
  }

  useEffect(() => {
    setTooltipVisible(isMultiLineOverflow())
  }, [maxLines, children])

  const ActualLineClamp = () => (
    <span {...props} className={styles} ref={ref}>
      {children}
    </span>
  )

  const styles = useMemo(() => lineClamp({ maxLines, className }), [className, maxLines])

  return isTooltipVisible ? (
    <Tooltip message={children} multiLine vertical="auto">
      <ActualLineClamp />
    </Tooltip>
  ) : (
    <ActualLineClamp />
  )
}
