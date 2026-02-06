import {
  type ComponentPropsWithoutRef,
  type FC,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { spacing } from '../../themes'
import { Stack } from '../Layout'
import { Text } from '../Text'

type AbstractProps = PropsWithChildren<{
  term: ReactNode
  termStyleType?: 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle'
  /** @deprecated DefinitionList で items を使う時の props です。children を使ってください。 */
  description?: ReactNode
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
    termEl: 'smarthr-ui-DefinitionListItem-term',
    descriptionEl:
      'smarthr-ui-DefinitionListItem-description shr-ms-[initial] shr-min-h-[calc(1em*theme(lineHeight.normal))] shr-pb-0.25',
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
  maxColumns,
  fullWidth,
  term,
  termStyleType = 'subBlockTitle',
  description,
  children,
  className,
}) => {
  const classNames = useMemo(() => {
    const { wrapper, termEl, descriptionEl } = classNameGenerator()

    return {
      wrapper: wrapper({ fullWidth, className }),
      term: termEl(),
      description: descriptionEl(),
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
      <DefinitionTerm styleType={termStyleType} className={classNames.term}>
        {term}
      </DefinitionTerm>
      <Text as="dd" size="M" color="TEXT_BLACK" leading="NORMAL" className={classNames.description}>
        {children ?? description}
      </Text>
    </Stack>
  )
}

const DefinitionTerm = memo<
  PropsWithChildren<{ styleType: Required<Props>['termStyleType']; className: string }>
>(({ styleType, className, children }) => (
  <Text as="dt" leading="TIGHT" styleType={styleType} className={className}>
    {children}
  </Text>
))
