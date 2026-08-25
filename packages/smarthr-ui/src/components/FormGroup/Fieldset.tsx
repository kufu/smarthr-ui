import { type ComponentProps, type FC, type ReactNode, useId, useRef } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'

import { FormGroup } from './FormGroup'

import type { ObjectLabelType } from './type'

type FormControlType = ComponentProps<typeof FormGroup>

const legendObjectConverter = (label: ReactNode) => ({ text: label })

export const Fieldset: FC<
  Omit<FormControlType, 'as' | 'label' | 'wrapperRef'> & {
    legend: ReactNode | ObjectLabelType
  }
> = ({ legend: orgLegend, ...rest }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  const baseLegend = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLegend,
    legendObjectConverter,
  )
  const legend = {
    ...baseLegend,
    htmlFor: baseLegend.htmlFor || `${baseId}-htmlFor`,
    id: baseLegend.id || `${baseId}-label`,
  }

  return <FormGroup {...rest} as="fieldset" wrapperRef={wrapperRef} label={legend} />
}
