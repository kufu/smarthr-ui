import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  isValidElement,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { spacing } from '../../themes'
import { Stack } from '../Layout'
import { Text } from '../Text'

type ObjectDtType = {
  text: ReactNode
  styleType?: 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle'
}
type AbstractProps = PropsWithChildren<{
  dt: ReactNode | ObjectDtType
  fullWidth?: boolean
  maxColumns?: number
}>
type Props = AbstractProps & Omit<ComponentPropsWithoutRef<'div'>, keyof AbstractProps>

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DefinitionListItem shr-border-b-shorthand shr-min-w-[12em] shr-grow shr-border-dotted',
      'contrast-more:shr-border-b-high-contrast',
    ],
    dt: 'smarthr-ui-DefinitionListItem-term',
    dd: 'smarthr-ui-DefinitionListItem-description shr-ms-[initial] shr-min-h-[calc(1em*theme(lineHeight.normal))] shr-pb-0.25',
  },
  variants: {
    fullWidth: {
      true: {
        wrapper: 'shr-basis-full',
      },
    },
  },
})

export const DefinitionListItem: FC<Props> = ({
  dt: orgDt,
  children,
  maxColumns,
  fullWidth,
  className,
}) => {
  // HINT: ReactNodeとObjectのどちらかを判定
  // typeofはnullの場合もobject判定されてしまうため念の為falsyで判定
  // ReactNodeの一部であるReactElementもobjectとして判定されてしまうためisValidElementで判定
  const dt: ObjectDtType =
    !orgDt || typeof orgDt !== 'object' || isValidElement(orgDt)
      ? {
          text: orgDt as ReactNode,
        }
      : (orgDt as ObjectDtType)

  const classNames = useMemo(() => {
    const cs = classNameGenerator()

    return {
      wrapper: cs.wrapper({ fullWidth, className }),
      dt: cs.dt(),
      dd: cs.dd(),
    }
  }, [className, fullWidth])
  const style = useMemo(
    () => ({
      flexBasis:
        // fullWidth の方が強い
        !fullWidth && maxColumns
          ? `calc((100% - ${spacing[1.5]} * ${maxColumns - 1}) / ${maxColumns})`
          : undefined,
    }),
    [fullWidth, maxColumns],
  )

  return (
    <Stack gap={0.25} className={classNames.wrapper} style={style}>
      <DefinitionTerm styleType={dt.styleType} className={classNames.dt}>
        {dt.text}
      </DefinitionTerm>
      <Text as="dd" size="M" color="TEXT_BLACK" leading="NORMAL" className={classNames.dd}>
        {children}
      </Text>
    </Stack>
  )
}

const DefinitionTerm = memo<
  PropsWithChildren<{ styleType: ObjectDtType['styleType']; className: string }>
>(({ styleType = 'subBlockTitle', className, children }) => (
  <Text as="dt" leading="TIGHT" styleType={styleType} className={className}>
    {children}
  </Text>
))
