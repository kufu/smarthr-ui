import { ActualFormControl } from '../FormControl/FormControl'

import type { ComponentProps, FC } from 'react'

type FormControlType = ComponentProps<typeof ActualFormControl>

export const Fieldset: FC<
  Omit<
    FormControlType,
    'as' | 'label' | 'labelType' | 'labelId' | 'htmlFor' | 'dangerouslyHideLabel'
  > & {
    legend: FormControlType['label']
    legendType?: FormControlType['labelType']
    dangerouslyHideLegend?: FormControlType['dangerouslyHideLabel']
  }
> = ({ legend, legendType, dangerouslyHideLegend, ...props }) => (
  <ActualFormControl
    {...props}
    label={legend}
    labelType={legendType}
    dangerouslyHideLabel={dangerouslyHideLegend}
    as="fieldset"
  />
)
