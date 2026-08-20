import { useId, useRef } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'
import { ActualFormControl, type ObjectLabelType, labelObjectConverter } from '../FormControl'

import type { ComponentProps, FC, ReactNode } from 'react'

type FormControlType = ComponentProps<typeof ActualFormControl>

export const Fieldset: FC<
  Omit<FormControlType, 'as' | 'label' | 'inputWrapperRef'> & {
    legend: Omit<Exclude<FormControlType['label'], ReactNode>, 'htmlFor'> | ReactNode
  }
> = ({ legend: orgLegend, ...rest }) => {
  const legend = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLegend,
    labelObjectConverter,
  )
  const baseId = useId()
  const inputWrapperRef = useRef<HTMLDivElement>(null)

  return (
    <ActualFormControl
      {...rest}
      label={{
        ...legend,
        htmlFor: legend.htmlFor || `${baseId}-htmlFor`,
        id: legend.id || `${baseId}-legend`,
      }}
      as="fieldset"
      inputWrapperRef={inputWrapperRef}
    />
  )
}
