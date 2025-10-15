import { ActualFormControl } from '../FormControl/FormControl'

import type { ComponentProps, FC } from 'react'

type FormControlType = ComponentProps<typeof ActualFormControl>

export const Fieldset: FC<
  Omit<
    FormControlType,
    'as' | 'label' | 'labelType' | 'labelId' | 'labelIcon' | 'htmlFor' | 'dangerouslyHideLabel'
  > & {
    legend: FormControlType['label']
    legendType?: FormControlType['labelType']
    legendIcon?: FormControlType['labelIcon']
    dangerouslyHideLegend?: FormControlType['dangerouslyHideLabel']
  }
> = ({ legend, legendType, legendIcon, dangerouslyHideLegend, ...props }) => (
  <ActualFormControl
    {...props}
    label={legend}
    labelType={legendType}
    labelIcon={legendIcon}
    dangerouslyHideLabel={dangerouslyHideLegend}
    as="fieldset"
  />
)
