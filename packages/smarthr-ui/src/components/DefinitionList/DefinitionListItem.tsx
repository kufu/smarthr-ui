import React, { ComponentPropsWithoutRef, FC, ReactNode, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useTheme } from '../../hooks/useTailwindTheme'
import { Stack } from '../Layout'
import { Text } from '../Text'

type DefinitionListItemProps = {
  term: ReactNode
  termStyleType: 'blockTitle' | 'subBlockTitle'
  description?: ReactNode
  fullWidth?: boolean
  maxColumns?: number
}
type ElementProps = Omit<ComponentPropsWithoutRef<'div'>, keyof DefinitionListItemProps>

const definitionListItem = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DefinitionListItem shr-border-b-shorthand shr-min-w-[12em] shr-grow shr-border-dotted',
      'contrast-more:shr-border-b-high-contrast',
    ],
    termEl: 'smarthr-ui-DefinitionListItem-term',
    descriptionEl:
      'smarthr-ui-DefinitionListItem-description min-h-[theme(lineHeight.normal)] shr-ms-[initial] shr-pb-0.25',
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
  termStyleType,
  description,
  className,
}) => {
  const { spacing } = useTheme()
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
  }, [className, fullWidth, maxColumns, spacing])

  return (
    <Stack {...wrapperStyleProps} gap={0.25}>
      <Text as="dt" size="S" leading="TIGHT" styleType={termStyleType} className={termStyle}>
        {term}
      </Text>
      <Text as="dd" size="M" color="TEXT_BLACK" leading="NORMAL" className={descriptionStyle}>
        {description}
      </Text>
    </Stack>
  )
}
