import React, { ComponentPropsWithoutRef, FC, PropsWithChildren, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { spacing } from '../../themes'
import { Stack } from '../Layout'
import { Text } from '../Text'

type DefinitionListItemProps = PropsWithChildren<{
  term: ReactNode
  termStyleType?: 'blockTitle' | 'subBlockTitle' | 'subSubBlockTitle'
  /** @deprecated DefinitionList で items を使う時の props です。children を使ってください。 */
  description?: ReactNode
  fullWidth?: boolean
  maxColumns?: number
}>
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof DefinitionListItemProps>

const definitionListItem = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DefinitionListItem shr-border-b-shorthand shr-min-w-[12em] shr-grow shr-border-dotted',
      'contrast-more:shr-border-b-high-contrast',
    ],
    termEl: 'smarthr-ui-DefinitionListItem-term',
    descriptionEl:
      'smarthr-ui-DefinitionListItem-description shr-ms-[initial] shr-pb-0.25 shr-min-h-[calc(1em*theme(lineHeight.normal))]',
  },
  variants: {
    fullWidth: {
      true: {
        wrapper: 'shr-basis-full',
      },
    },
  },
})

export const DefinitionListItem: FC<DefinitionListItemProps & ElementProps> = ({
  maxColumns,
  fullWidth,
  term,
  termStyleType = 'subBlockTitle',
  description,
  children,
  className,
}) => {
  const { wrapperStyleProps, termStyle, descriptionStyle } = useMemo(() => {
    const { wrapper, termEl, descriptionEl } = definitionListItem()
    return {
      wrapperStyleProps: {
        className: wrapper({ fullWidth, className }),
        style: {
          flexBasis:
            // fullWidth の方が強い
            !fullWidth && maxColumns
              ? `calc((100% - ${spacing[1.5]} * ${maxColumns - 1}) / ${maxColumns})`
              : undefined,
        },
      },
      termStyle: termEl(),
      descriptionStyle: descriptionEl(),
    }
  }, [className, fullWidth, maxColumns])

  return (
    <Stack {...wrapperStyleProps} gap={0.25}>
      <Text as="dt" leading="TIGHT" styleType={termStyleType} className={termStyle}>
        {term}
      </Text>
      <Text as="dd" size="M" color="TEXT_BLACK" leading="NORMAL" className={descriptionStyle}>
        {children ?? description}
      </Text>
    </Stack>
  )
}
